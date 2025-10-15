import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  body: string;
}
