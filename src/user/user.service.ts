import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable() //decorator que marca a class como um Provider, pronta para ser injetada em outras classes
export class UserService {
  @Inject() //essa injeção poderia ser também por constructor
  private readonly prisma: PrismaService;

  //pega um usuário(read)
  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    // método do prisma para buscar um único registro
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput, //retorna um user(se encontrado) ou null
    });
  }

  //o prisma cria varíos tipos, de acordo com nosso bd
  //Create
  async createUser(data: Prisma.UserCreateInput) {
    const hashPassword = await bcrypt.hash(data.password, 10); //regra de negócio
    // método de inserção do prisma
    return this.prisma.user.create({
      //criptografia
      data: { ...data, password: hashPassword }, //copia tudo do data e substitui o password pelo password do hash
    });
  }

  //update
  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput; //where é o id
    //dados a serem atualizados
    data: Prisma.UserUpdateInput; //tipo para update
  }): Promise<User> {
    const { where, data } = params;
    //executa a atualização no banco
    return this.prisma.user.update({
      data,
      where,
    });
  }

  // delete
  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    //   recebe o id ^,  remove o rejistro
    return this.prisma.user.delete({
      where,
    });
  }
}
