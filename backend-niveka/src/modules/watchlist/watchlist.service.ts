import { Injectable } from '@nestjs/common';
import { supabase } from '../../config/supabase.config';
import { AddWatchlistDto } from './dto/add-watchlist.dto';

@Injectable()
export class WatchlistService {

  async getWatchlist(userId: string) {
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async add(userId: string, dto: AddWatchlistDto) {
    // check if already in watchlist
    const { data: existing } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', userId)
      .eq('movie_id', dto.movie_id)
      .single();

    if (existing) return { message: 'Already in watchlist' };

    const { data, error } = await supabase
      .from('watchlist')
      .insert({ user_id: userId, ...dto })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async remove(userId: string, movieId: number) {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('movie_id', movieId);

    if (error) throw new Error(error.message);
    return { message: 'Removed from watchlist' };
  }

  async checkInWatchlist(userId: string, movieId: number) {
    const { data } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', userId)
      .eq('movie_id', movieId)
      .single();

    return { inWatchlist: !!data };
  }
}