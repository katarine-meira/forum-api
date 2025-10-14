import { Inject, Injectable } from '@nestjs/common';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class AnswersService {
  @Inject()
  private readonly prisma: PrismaService;

  create(createAnswerDto: CreateAnswerDto, userId: any, questionId: number) {
    const newAnswer = {
      body: createAnswerDto.body,
      // prara buscar o id teve que seguir o caminho:
      // AnswersCreateInput > user > connect > id
      // AnswersCreateInput > questions > connect > id
      user: {
        connect: { id: userId.sub },
      },
      question: {
        connect: { id: questionId },
      },
    };
    return this.prisma.answers.create({
      data: newAnswer,
    });
  }

  findAll() {
    return this.prisma.questions.findMany();
  }

  findOne(id: number) {
    return this.prisma.questions.findUnique({ where: { id } });
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto) {
    return this.prisma.questions.update({
      where: { id },
      data: updateAnswerDto,
    });
  }

  remove(id: number) {
    return this.prisma.questions.delete({ where: { id } });
  }
}
