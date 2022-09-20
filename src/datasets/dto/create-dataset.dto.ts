import { IsArray, IsNotEmpty, IsString } from 'class-validator';

class Hashtag {
  @IsString()
  hashtag: string;
}

export class CreateDatasetDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsArray()
  hashtag: Hashtag[];
}
