import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateQuestionDto {
  //o user ao criar uma qustão não passa o id, o dto me da a opção de esconder o que eu quiser
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  body: string;
}
