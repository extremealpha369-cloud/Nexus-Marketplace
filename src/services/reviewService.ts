import { supabase } from '../lib/supabase';
import { Review } from '../types';

export const reviewService = {
  async getReviews(productId: string): Promise<Review[]> {
    const { data: reviewsData, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!reviewsData || reviewsData.length === 0) return [];

    const userIds = [...new Set(reviewsData.map(r => r.user_id))];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .in('id', userIds);

    const profilesMap = new Map((profilesData || []).map(p => [p.id, p]));

    return reviewsData.map(r => ({
      ...r,
      user: profilesMap.get(r.user_id) || null
    }));
  },

  async getReviewsByUser(userId: string): Promise<Review[]> {
    const { data: reviewsData, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!reviewsData || reviewsData.length === 0) return [];

    const productIds = [...new Set(reviewsData.map(r => r.product_id))];
    const { data: productsData } = await supabase
      .from('products')
      .select('id, name')
      .in('id', productIds);

    const productsMap = new Map((productsData || []).map(p => [p.id, p]));

    return reviewsData.map(r => ({
      ...r,
      product: productsMap.get(r.product_id) || null
    }));
  },

  async getSellerReviews(sellerId: string): Promise<Review[]> {
    // 1. Get products by seller first
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, name, user_id')
      .eq('user_id', sellerId);

    if (productsError) throw productsError;
    if (!productsData || productsData.length === 0) return [];

    const productIds = productsData.map(p => p.id);
    const productsMap = new Map(productsData.map(p => [p.id, p]));

    // 2. Get reviews for these products
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .in('product_id', productIds)
      .order('created_at', { ascending: false });

    if (reviewsError) throw reviewsError;
    if (!reviewsData || reviewsData.length === 0) return [];

    // 3. Get profiles for reviewers
    const userIds = [...new Set(reviewsData.map(r => r.user_id))];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .in('id', userIds);

    const profilesMap = new Map((profilesData || []).map(p => [p.id, p]));

    return reviewsData.map(r => ({
      ...r,
      user: profilesMap.get(r.user_id) || null,
      product: productsMap.get(r.product_id) || null
    }));
  },

  async createReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    const { data: reviewData, error } = await supabase
      .from('reviews')
      .insert(review)
      .select('*')
      .single();

    if (error) throw error;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .eq('id', reviewData.user_id)
      .single();

    return {
      ...reviewData,
      user: profileData || null
    };
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
