import { Injectable, NotFoundException } from '@nestjs/common';
import { supabase } from '../../config/supabase.config';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw new NotFoundException('Profile not found');
    return data;
  }

  async getProfileStats(userId: string) {
    const [reviewsRes, watchlistRes] = await Promise.all([
      supabase
        .from('reviews')
        .select('rating')
        .eq('user_id', userId),
      supabase
        .from('watchlist')
        .select('id', { count: 'exact' })
        .eq('user_id', userId),
    ]);

    const reviews     = reviewsRes.data  || [];
    const wlCount     = watchlistRes.count || 0;
    const totalReviews = reviews.length;
    const avgRating   = totalReviews
      ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)
      : null;

    return {
      totalReviews,
      avgRating: avgRating ? Number(avgRating) : null,
      watchlistCount: wlCount,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const { data, error } = await supabase
      .from('profiles')
      .update(dto)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async getReviewHistory(userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new NotFoundException(error.message);
    return data;
  }
}