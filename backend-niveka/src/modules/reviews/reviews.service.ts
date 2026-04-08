import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { supabase } from '../../config/supabase.config';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {

  // ── Get all reviews for a movie ──
  async getReviews(movieId: number) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(username, avatar_url)')
      .eq('movie_id', movieId)
      .order('created_at', { ascending: false });

    if (error) throw new NotFoundException(error.message);
    return data;
  }

  // ── Get average rating for a movie ──
  async getAverageRating(movieId: number) {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('movie_id', movieId);

    if (error) throw new NotFoundException(error.message);

    if (!data || data.length === 0) {
      return { average: null, count: 0 };
    }

    const average = (
      data.reduce((sum, r) => sum + r.rating, 0) / data.length
    ).toFixed(1);

    return { average: Number(average), count: data.length };
  }

  // ── Create a review ──
  async create(userId: string, dto: CreateReviewDto) {
    // check if user already reviewed this movie
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', userId)
      .eq('movie_id', dto.movie_id)
      .single();

    if (existing) {
      throw new ForbiddenException(
        'You have already reviewed this movie. Edit your existing review.'
      );
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({ user_id: userId, ...dto })
      .select('*, profiles(username, avatar_url)')
      .single();

    if (error) throw new NotFoundException(error.message);
    return data;
  }

  // ── Update a review ──
  async update(reviewId: string, userId: string, dto: UpdateReviewDto) {
    // verify ownership
    const { data: review } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();

    if (!review) throw new NotFoundException('Review not found');
    if (review.user_id !== userId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    const { data, error } = await supabase
      .from('reviews')
      .update({ ...dto, updated_at: new Date() })
      .eq('id', reviewId)
      .select('*, profiles(username, avatar_url)')
      .single();

    if (error) throw new NotFoundException(error.message);
    return data;
  }

  // ── Delete a review ──
  async remove(reviewId: string, userId: string) {
    const { data: review } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();

    if (!review) throw new NotFoundException('Review not found');
    if (review.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw new NotFoundException(error.message);
    return { message: 'Review deleted successfully' };
  }
}