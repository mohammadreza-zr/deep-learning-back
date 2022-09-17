import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(3, 350)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 350)
  password: string;
}
