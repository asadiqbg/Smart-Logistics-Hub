import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  minLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  tenantId: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  role?: string;
}
