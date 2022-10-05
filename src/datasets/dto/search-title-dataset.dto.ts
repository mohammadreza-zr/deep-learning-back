import { alphabetNumberSpaceUnderscoreDash } from 'src/validate-patterns';
import { IsString, Matches, IsDefined, IsNotEmpty } from 'class-validator';

export class SearchTitleDatasetDto {
  @IsNotEmpty()
  @IsString()
  @Matches(alphabetNumberSpaceUnderscoreDash, {
    message: 'Not Allowed!',
  })
  title: string;
}
