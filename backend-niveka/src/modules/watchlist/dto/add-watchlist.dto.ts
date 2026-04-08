import { IsNumber, IsString } from 'class-validator';

export class AddWatchlistDto {
  @IsNumber()
  movie_id!: number;

  @IsString()
  movie_title!: string;

  @IsString()
  poster_path!: string;
}