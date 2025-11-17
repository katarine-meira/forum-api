import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(AuthGuard) //tem que estar logado
  //ta pegando o userId da request do quardian
  create(
    @Body(new ValidationPipe()) createQuestionDto: CreateQuestionDto,
    @Request() req: any,
  ) {
    return this.questionsService.create(createQuestionDto, req);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.questionsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.STUDENT, Role.MEMBER, Role.LEADER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.STUDENT, Role.MEMBER, Role.LEADER)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.remove(id);
  }
}
