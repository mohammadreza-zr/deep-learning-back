import { IsOptional, IsString, Matches } from 'class-validator';
import { alphabetNumberSpaceUnderscoreDash } from 'src/validate-patterns';

export class QueryDatasetDto {
  @IsOptional()
  @IsString()
  @Matches(alphabetNumberSpaceUnderscoreDash, {
    message: 'Not Allowed!',
  })
  skip: string;

  @IsOptional()
  @IsString()
  @Matches(alphabetNumberSpaceUnderscoreDash, {
    message: 'Not Allowed!',
  })
  hashtag: string;
}
