import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}

//aqui no update não precisa implementar, porque ele extende do create
//e ele extende PartialType, ou seja, torna os campos opcionais
