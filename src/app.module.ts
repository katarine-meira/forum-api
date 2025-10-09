import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [], //modulo principal, todos importados aqui
  controllers: [AppController], //apenas controla
  providers: [AppService], //a lógica(regra de negocio)
})
export class AppModule {}
