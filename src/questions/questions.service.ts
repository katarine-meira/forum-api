import { Inject, Injectable, Request } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
//CRUD de questions
export class QuestionsService {
  @Inject()
  private readonly prisma: PrismaService;

  //quem cria a quatão é o usuário          //preciso do id para saber qual é o user logado
  async create(createQuestionDto: CreateQuestionDto, req: any) {
    return await this.prisma.questions.create({
      //o prisma exige um title, body e Id
      data: { ...createQuestionDto, userId: req.sub.sub }, //retorna tudo do create-quetion.dto + o id (que ja temos)
    });
  }

  //pegar tudo
  async findAll() {
    //retorna tudo de questions + o array de answers
    return await this.prisma.questions.findMany({
      include: {
        answers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          //da parta selecionar apeas as informações que eu quero passar (em Prisma relation-queries tem mais)
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  //pega apenas um (ID)
  async findOne(id: number) {
    return await this.prisma.questions.findUnique({
      where: { id },
      include: {
        answers: true,
        user: {
          //da parta selecionar apeas as informações que eu quero passar (em Prisma relation-queries tem mais)
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  //atualizar question
  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    //recebe o id para atualizar
    return await this.prisma.questions.update({
      where: { id },
      data: updateQuestionDto,
    });
  }

  //deleta uma question pelo id
  remove(id: number) {
    return this.prisma.questions.delete({ where: { id } });
  }
}
