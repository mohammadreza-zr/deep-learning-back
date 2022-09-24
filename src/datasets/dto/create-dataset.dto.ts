import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { alphabetNumberSpaceUnderscoreDash } from 'src/validate-patterns';

class Hashtag {
  @IsString()
  hashtag: string;
}

export class CreateDatasetDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Matches(alphabetNumberSpaceUnderscoreDash, {
    message: 'title not allowed!',
  })
  title: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  body: string;

  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  hashtag: Hashtag[];
}
