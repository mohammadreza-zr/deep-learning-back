import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(3, 350)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 350)
  password: string;
}
