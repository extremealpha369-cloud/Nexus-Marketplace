import { supabase } from '../lib/supabase';
import { Review, ReviewReply } from '../types';

export const reviewService = {
  async getReviews(productId: string): Promise<Review[]> {
    const { data: reviewsData, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!reviewsData || reviewsData.length === 0) return [];

    // Fetch reviewers
    const reviewerIds = [...new Set(reviewsData.map(r => r.reviewer_id))];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .in('id', reviewerIds);

    const profilesMap = new Map((profilesData || []).map(p => [p.id, p]));

    // Fetch replies
    const reviewIds = reviewsData.map(r => r.id);
    const { data: repliesData } = await supabase
      .from('review_replies')
      .select('*')
      .in('review_id', reviewIds);

    const repliesMap = new Map();
    (repliesData || []).forEach(reply => {
      if (!repliesMap.has(reply.review_id)) {
        repliesMap.set(reply.review_id, []);
      }
      repliesMap.get(reply.review_id).push(reply);
    });

    return reviewsData.map(r => ({
      ...r,
      user: profilesMap.get(r.reviewer_id) || null,
      replies: repliesMap.get(r.id) || []
    }));
  },

  async getReviewsByUser(userId: string): Promise<Review[]> {
    const { data: reviewsData, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('reviewer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!reviewsData || reviewsData.length === 0) return [];

    const productIds = [...new Set(reviewsData.map(r => r.product_id))];
    const { data: productsData } = await supabase
      .from('products')
      .select('id, name')
      .in('id', productIds);

    const productsMap = new Map((productsData || []).map(p => [p.id, p]));

    // Fetch replies
    const reviewIds = reviewsData.map(r => r.id);
    const { data: repliesData } = await supabase
      .from('review_replies')
      .select('*')
      .in('review_id', reviewIds);

    const repliesMap = new Map();
    (repliesData || []).forEach(reply => {
      if (!repliesMap.has(reply.review_id)) {
        repliesMap.set(reply.review_id, []);
      }
      repliesMap.get(reply.review_id).push(reply);
    });

    return reviewsData.map(r => ({
      ...r,
      product: productsMap.get(r.product_id) || null,
      replies: repliesMap.get(r.id) || []
    }));
  },

  async getSellerReviews(sellerId: string): Promise<Review[]> {
    // 1. Get reviews for products owned by seller
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_owner_id', sellerId)
      .order('created_at', { ascending: false });

    if (reviewsError) throw reviewsError;
    if (!reviewsData || reviewsData.length === 0) return [];

    // 2. Get products details
    const productIds = [...new Set(reviewsData.map(r => r.product_id))];
    const { data: productsData } = await supabase
      .from('products')
      .select('id, name')
      .in('id', productIds);
    
    const productsMap = new Map((productsData || []).map(p => [p.id, p]));

    // 3. Get profiles for reviewers
    const reviewerIds = [...new Set(reviewsData.map(r => r.reviewer_id))];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .in('id', reviewerIds);

    const profilesMap = new Map((profilesData || []).map(p => [p.id, p]));

    // 4. Get replies
    const reviewIds = reviewsData.map(r => r.id);
    const { data: repliesData } = await supabase
      .from('review_replies')
      .select('*')
      .in('review_id', reviewIds);

    const repliesMap = new Map();
    (repliesData || []).forEach(reply => {
      if (!repliesMap.has(reply.review_id)) {
        repliesMap.set(reply.review_id, []);
      }
      repliesMap.get(reply.review_id).push(reply);
    });

    return reviewsData.map(r => ({
      ...r,
      user: profilesMap.get(r.reviewer_id) || null,
      product: productsMap.get(r.product_id) || null,
      replies: repliesMap.get(r.id) || []
    }));
  },

  async createReview(review: Omit<Review, 'id' | 'created_at' | 'user' | 'product' | 'replies'>): Promise<Review> {
    const { data: reviewData, error } = await supabase
      .from('product_reviews')
      .insert(review)
      .select('*')
      .single();

    if (error) throw error;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .eq('id', reviewData.reviewer_id)
      .single();

    return {
      ...reviewData,
      user: profileData || null,
      replies: []
    };
  },

  async updateReview(id: string, updates: Partial<Review>): Promise<Review> {
    const { data, error } = await supabase.from('product_reviews').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteReview(id: string): Promise<void> {
    const { error } = await supabase.from('product_reviews').delete().eq('id', id);
    if (error) throw error;
  },

  async replyToReview(reviewId: string, ownerId: string, text: string): Promise<ReviewReply> {
    const { data, error } = await supabase
      .from('review_replies')
      .insert({
        review_id: reviewId,
        owner_id: ownerId,
        reply_text: text
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }
};
