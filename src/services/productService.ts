import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const productService = {
  async getProducts(userId?: string): Promise<Product[]> {
    let query = supabase.from('products').select('*');
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getPublicProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, user:profiles(*)')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'views' | 'shares'>): Promise<Product> {
    const { data, error } = await supabase.from('products').insert(product).select().single();
    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  async incrementViews(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_views', { product_id: id });
    if (error) console.error('Error incrementing views:', error);
  }
};
