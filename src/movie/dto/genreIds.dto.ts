import { IsArray, IsString, MinLength } from 'class-validator';

export class GenreIdsDto {
  @IsArray({ message: 'array of genreIds must be correct' })
  @IsString({ each: true })
  @MinLength(24, { each: true })
  genreIds: string[];
}
