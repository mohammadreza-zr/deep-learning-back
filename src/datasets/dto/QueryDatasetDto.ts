import { IsOptional, IsString, Matches } from 'class-validator';
import { alphabetNumberSpaceUnderscoreDash } from 'src/validate-patterns';

const regex = /^[a-z\d\-_.()\/\s]+$/i;
export class QueryDatasetDto {
  @IsOptional()
  @IsString()
  @Matches(alphabetNumberSpaceUnderscoreDash, {
    message: 'Not Allowed!',
  })
  skip: string;

  @IsOptional()
  @IsString()
  @Matches(regex, {
    message: 'Not Allowed!',
  })
  hashtag: string;
}
