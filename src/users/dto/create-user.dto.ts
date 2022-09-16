import { IsEmail, IsNotEmpty, IsString, Max } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Max(350)
  public email: string;

  @Max(250)
  @IsString()
  @IsNotEmpty()
  public fullName: string;

  @Max(350)
  @IsString()
  @IsNotEmpty()
  public password: string;
}
