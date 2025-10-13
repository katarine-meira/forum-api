import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    @Inject()
    private readonly authService: AuthService;

    //singin é sempre um post(ceate)
    @Post('signin')
    @HttpCode(HttpStatus.OK) //constructor que muda o retorno (mudei para o 200)
    singin(@Body() body: Prisma.UserCreateInput){
        return this.authService.signin(body); //retorna o user sem a senha
    }
}

