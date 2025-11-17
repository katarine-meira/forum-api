import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
