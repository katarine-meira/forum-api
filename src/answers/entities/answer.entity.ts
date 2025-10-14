import { User } from '../../user/entities/user.entity';
import { Question } from '../../questions/entities/question.entity';
import { Answers } from '@prisma/client';

// o entities serve de Mapeamento de Domínio, define o contrato de como
// um objeto Answer deve ser em toda a aplicação
// ter uma class pópria evita acoplar seu código diretamente ao Prisma
export class Answer implements Answers {
  id: number;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  questionId: number;
  user: User;
  questions: Question;
}
