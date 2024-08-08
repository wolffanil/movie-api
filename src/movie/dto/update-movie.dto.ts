import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class Parameters {
  @IsNumber()
  year: number;

  @IsNumber()
  duration: number;

  @IsString()
  contry: string;
}

export class UpdateMovieDto {
  @IsString()
  title: string;

  @IsString()
  poster: string;

  @IsString()
  bigPoster: string;

  @IsString()
  slug: string;

  @IsObject()
  parameters?: Parameters;

  @IsString()
  videoUrl: string;

  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @IsArray()
  @IsString({ each: true })
  actors: string[];

  isSendTelegram?: boolean;
}
