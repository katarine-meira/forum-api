import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [AuthModule, UserModule, DatabaseModule, QuestionsModule], //modulo principal, todos importados aqui
  // controllers: [], //apenas controla
  // providers: [], //a lógica(regra de negocio)
})
export class AppModule {}
