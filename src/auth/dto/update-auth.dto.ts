import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto, Rule } from './create-auth.dto';
import { IsNotEmpty, IsString, IsInt, Length, Max } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @IsNotEmpty()
  @IsString()
  @Length(3, 12)
  changeRule: Rule;

  @IsInt()
  @Max(999999)
  verifyCode: number;
}
