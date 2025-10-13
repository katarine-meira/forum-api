import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable() //torna a class AuthService como um provider injetavel em controladores (como o AuthCotroller) ou outros servicos
export class AuthService {
  @Inject()
  private readonly userService: UserService; // injeta o provider UserService pra poder ser reutilizado funções do prisma (como consulta de usuário)

  @Inject()
  private readonly jwtService: JwtService;

  //email e password
  async signin(
    params: Prisma.UserCreateInput): Promise<{access_token: string}> {
    //retorna um tipo omit para omitir o password do user
    const user = await this.userService.user({ email: params.email }); //usa o metodo user de UserService para localizar um user por meio do email
    if (!user) throw new NotFoundException('User not found');
    const passwordMatch = await bcrypt.compare(params.password, user.password); //compara a senha digitada com o hash no sistema, retorna um true ou false
    if (!passwordMatch) throw new UnauthorizedException('Invalide credentials');

    const payload = { sub: user.id }; //esse sub é padrão do jwt
    //retorna o acssestoken em formato de objeto passando o id (dento de payload)
    return {access_token: await this.jwtService.signAsync(payload)}; 
  }
}
