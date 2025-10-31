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
      include: {
        user: { select: { id: true, name: true } },
        question: { select: { id: true } },
      },
    });
  }

  findAll() {
    return this.prisma.answers.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.answers.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        question: { select: { id: true, title: true } },
      },
    });
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto) {
    return this.prisma.answers.update({
      where: { id },
      data: updateAnswerDto,
    });
  }

  remove(id: number) {
    return this.prisma.answers.delete({ where: { id } });
  }
}
