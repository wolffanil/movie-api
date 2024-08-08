import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'password must be not less 6 char',
  })
  @IsOptional()
  password?: string;

  isAdmin?: boolean;
}
