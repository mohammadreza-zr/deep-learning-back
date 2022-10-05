import { alphabetNumberSpaceUnderscoreDash } from 'src/validate-patterns';
import { IsString, Matches } from 'class-validator';

export class SearchDto {
  @IsString()
  @Matches(alphabetNumberSpaceUnderscoreDash, {
    message: 'Search Not Allowed!',
  })
  search: string;
}
