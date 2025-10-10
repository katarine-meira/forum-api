import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  @Inject()
  private readonly userService: UserService;

  //email e password
  async singin(
    params: Prisma.UserCreateInput,
  ): Promise<Omit<User, 'password'>> {
    //retorna um tipo omit para omitir o password do user
    const user = await this.userService.user({ email: params.email });
    if (!user) throw new NotFoundException('User not found');
    const passwordMatch = await bcrypt.compare(params.password, user.password); //retorna um true ou false
    if (!passwordMatch) throw new UnauthorizedException('Invalide credentials');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    return result; //retorna tudo menos a password
  }
}
