import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailToken {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  token: string;
}
