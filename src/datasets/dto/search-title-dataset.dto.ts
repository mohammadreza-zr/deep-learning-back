import { IsNotEmpty, IsString } from 'class-validator';

export class SearchTitleDatasetDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
