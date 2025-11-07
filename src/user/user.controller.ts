import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User as UserModel } from '@prisma/client';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

//CRUD
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post() //create (cria um usuário)
  async signupUser(
    @Body(new ValidationPipe()) CreateUserDto: CreateUserDto, //valida o create
  ): Promise<UserModel> {
    return this.userService.createUser(CreateUserDto);
  }

  // GET /user/me — retorna dados do usuário logado
  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    const userId = req.sub.sub;
    return this.userService.user({ id: userId });
  }

  // PUT /user/me — atualiza nome/email (usada apenas por usuário logado)
  @UseGuards(AuthGuard)
  @Put('me')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/users', // pasta onde serão salvos
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  async updateProfile(
    @Req() req,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
    @Body()
    body: {
      name?: string;
      email?: string;
      bio?: string;
      github?: string;
      linkedin?: string;
      skills?: string;
      semester?: string;
    },
  ) {
    const userId = req.sub.sub;

    const avatarFile = files?.avatar?.[0];
    const bannerFile = files?.banner?.[0];

    // adiciona URLs se houver upload
    const dataToUpdate = {
      ...body,
      ...(avatarFile && { avatarUrl: `/uploads/users/${avatarFile.filename}` }),
      ...(bannerFile && { bannerUrl: `/uploads/users/${bannerFile.filename}` }),
    };

    return this.userService.updateUser({
      where: { id: userId },
      data: dataToUpdate,
    });
  }

  @UseGuards(AuthGuard)
  @Put('me/password')
  async updatePassword(
    @Req() req,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const userId = req.sub.sub;
    // Busca o user com a senha
    const user = await this.userService.findByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verifica senha atual
    const isPasswordValid = await bcrypt.compare(
      body.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Senha atual incorreta');
    }

    // Gera nova senha
    const hashed = await bcrypt.hash(body.newPassword, 10);

    await this.userService.updateUser({
      where: { id: userId },
      data: { password: hashed },
    });

    return { message: 'Senha alterada com sucesso!' };
  }

  @UseGuards(AuthGuard)
  @Get(':id') //read (ler um usuário por id)
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Omit<UserModel, 'password'> | null> {
    return this.userService.user({ id }); //id na url é sempre lido como string, por isso a conversão
  } //chama o método User (em UserService) para encontrar o user pelo id

  //esse update é protegido para que apenas users internos altere qualquer usuário
  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Body(new ValidationPipe()) userData: UpdateUserDto, //os dados a ser alterados
    @Param('id', ParseIntPipe) id: number, //o id para saber o usuário
  ): Promise<UserModel> {
    return this.userService.updateUser({
      //chama o método updateUser passando um objeto:
      where: { id }, //para identificar o user
      data: userData, //os novos dados a serem aplicados
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<UserModel> {
    //chama o método deleteUser do userService passando o objeto where para identificar o registro
    return this.userService.deleteUser({ id });
  }
}
