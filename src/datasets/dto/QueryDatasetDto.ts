import { IsOptional, IsString } from 'class-validator';

export class QueryDatasetDto {
  @IsOptional()
  @IsString()
  skip: string;
}
