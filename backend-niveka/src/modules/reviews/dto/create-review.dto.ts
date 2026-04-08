import { IsNumber, IsString, Min, Max, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  movie_id!: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @MinLength(20)
  body!: string;
}