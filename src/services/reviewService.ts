import { supabase } from '../lib/supabase';
import { Review } from '../types';

export const reviewService = {
  async getReviews(productId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, user:profiles(name, avatar_url)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getReviewsByUser(userId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, product:products(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getSellerReviews(sellerId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, user:profiles(name, avatar_url), product:products!inner(name, user_id)')
      .eq('product.user_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select('*, user:profiles(name, avatar_url)')
      .single();

    if (error) throw error;
    return data;
  },

  async updateReview(id: string, updates: Partial<Review>): Promise<Review> {
    const { data, error } = await supabase.from('reviews').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteReview(id: string): Promise<void> {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) throw error;
  },

  async replyToReview(reviewId: string, text: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .update({ reply_text: text, replied_at: new Date().toISOString() })
      .eq('id', reviewId);

    if (error) throw error;
  }
};
