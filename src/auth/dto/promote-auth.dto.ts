import { IsNotEmpty, Length, IsEmail } from 'class-validator';

export class PromoteAuthDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(3, 350)
  email: string;
}
