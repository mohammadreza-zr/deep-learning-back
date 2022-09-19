import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailToken {
  @IsNotEmpty()
  @IsString()
  token: string;
}
