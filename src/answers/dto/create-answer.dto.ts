import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  body: string;
}
