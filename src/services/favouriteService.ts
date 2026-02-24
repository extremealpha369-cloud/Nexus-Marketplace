import { supabase } from '../lib/supabase';
import { Favourite } from '../types';

export const favouriteService = {
  async getFavourites(userId: string): Promise<Favourite[]> {
    const { data, error } = await supabase
      .from('favourites')
      .select('*, product:products(*, user:profiles(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addFavourite(userId: string, productId: string): Promise<Favourite> {
    const { data, error } = await supabase
      .from('favourites')
      .insert({ user_id: userId, product_id: productId })
      .select('*, product:products(*)')
      .single();

    if (error) throw error;
    return data;
  },

  async removeFavourite(userId: string, productId: string): Promise<void> {
    const { error } = await supabase
      .from('favourites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
  },

  async updateFavourite(id: string, updates: Partial<Favourite>): Promise<void> {
    const { error } = await supabase
      .from('favourites')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  }
};
