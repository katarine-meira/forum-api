import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable() //torna a class AuthService como um provider injetavel em controladores (como o AuthCotroller) ou outros servicos
export class AuthService {
  @Inject()
  private readonly prisma: PrismaService; // injeta o provider PrismaService pra poder ser reutilizado funções dados para ações (como validação)

  @Inject()
  private readonly jwtService: JwtService;

  //CADASTRO
  async signup(dto: SignUpDto): Promise<{ access_token: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });

    const payload = { sub: user.id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  //email e password (LOGIN)
  async signin(dto: SignInDto): Promise<{ access_token: string }> {
    //retorna um tipo omit para omitir o password do user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    }); //usa o metodo user de UserService para localizar um user por meio do email
    if (!user) throw new NotFoundException('User not found');
    const passwordMatch = await bcrypt.compare(dto.password, user.password); //compara a senha digitada com o hash no sistema, retorna um true ou false
    if (!passwordMatch) throw new UnauthorizedException('Invalide credentials');

    const payload = { sub: user.id }; //esse sub é padrão do jwt
    //retorna o acssestoken em formato de objeto passando o id (dento de payload)
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
