import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // GET /api/v1/reviews/movie/:movieId — public
  @Get('movie/:movieId')
  getReviews(@Param('movieId') movieId: number) {
    return this.reviewsService.getReviews(Number(movieId));
  }

  // GET /api/v1/reviews/movie/:movieId/average — public
  @Get('movie/:movieId/average')
  getAverageRating(@Param('movieId') movieId: number) {
    return this.reviewsService.getAverageRating(Number(movieId));
  }

  // POST /api/v1/reviews — auth required
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, dto);
  }

  // PATCH /api/v1/reviews/:id — auth required
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, req.user.id, dto);
  }

  // DELETE /api/v1/reviews/:id — auth required
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.reviewsService.remove(id, req.user.id);
  }
}