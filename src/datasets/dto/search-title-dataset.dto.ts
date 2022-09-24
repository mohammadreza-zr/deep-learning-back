import { IsString, Matches, IsDefined } from 'class-validator';

const pattern = /^[a-z\d\-_\s]+$/i;
export class SearchTitleDatasetDto {
  @IsDefined()
  @IsString()
  @Matches(pattern, {
    message: 'Not Allowed!',
  })
  title: string;
}
