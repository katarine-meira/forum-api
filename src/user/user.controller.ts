import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Prisma, User as UserModel } from '@prisma/client';
import { UserService } from './user.service';

//CRUD
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post() //create (cria um usuário)
  async signupUser(
    @Body() userData: Prisma.UserCreateInput,
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Get(':id') //read (ler um usuário por id)
  async getUser(@Param('id') id: string): Promise<UserModel | null> {
    return this.userService.user({ id: Number(id) }); //id na url é sempre lido como string, por isso a conversão
  } //chama o método User (em UserService) para encontrar o user pelo id

  @Put(':id')
  async updateUser(
    @Body() userData: Prisma.UserUpdateInput, //os dados a ser alteraros
    @Param('id') id: string, //o id para saber o usuário
  ): Promise<UserModel> {
    return this.userService.updateUser({
      //chama o método updateUser passando um objeto:
      where: { id: Number(id) }, //para identificar o user
      data: userData, //os novos dados a serem aplicados
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    //chama o método deleteUser do userService passando o objeto where para identificar o registro
    return this.userService.deleteUser({ id: Number(id) });
  }
}
