import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @UseGuards(AuthGuard)
  @Get(':id') //read (ler um usuário por id)
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Omit<UserModel, 'password'> | null> {
    return this.userService.user({ id }); //id na url é sempre lido como string, por isso a conversão
  } //chama o método User (em UserService) para encontrar o user pelo id

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
