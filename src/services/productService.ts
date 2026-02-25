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

  async getPublicProducts(filters?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    brand?: string;
  }): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*, user:profiles(*)')
      .eq('visibility', 'public');

    if (filters) {
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }
      if (filters.brand) {
        query = query.ilike('brand', `%${filters.brand}%`);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching public products:', error);
      return [];
    }
    return data || [];
  },

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase.from('products').select('*, user:profiles(*)').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'views' | 'share_count'>): Promise<Product> {
    // Backend validation
    if (!product.name || !product.description || !product.price || !product.category) {
      throw new Error('Missing required fields: name, description, price, or category');
    }
    if (product.price < 0) {
      throw new Error('Price cannot be negative');
    }

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
    if (error) {
      console.error('Error incrementing views (RPC function might be missing):', error);
    }
  }
};
