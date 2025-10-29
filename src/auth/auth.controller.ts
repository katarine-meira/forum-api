import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body(new ValidationPipe()) dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  //singin é sempre um post(ceate)
  @Post('signin')
  @HttpCode(HttpStatus.OK) //constructor que muda o retorno (mudei para o 200)
  signin(@Body(new ValidationPipe()) dto: SignInDto) {
    return this.authService.signin(dto);
  }
}
