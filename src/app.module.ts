import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule], //modulo principal, todos importados aqui
  controllers: [], //apenas controla
  providers: [], //a lógica(regra de negocio)
})
export class AppModule {}
