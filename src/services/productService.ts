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
    sortBy?: string;
  }): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')
      .eq('visibility', 'public');

    if (filters) {
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }
      if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice.toString() !== '') {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice.toString() !== '') {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.condition && filters.condition !== 'Any') {
        query = query.eq('condition', filters.condition);
      }
      if (filters.brand && filters.brand !== 'All Brands') {
        query = query.ilike('brand', `%${filters.brand}%`);
      }
    }

    let orderColumn = 'created_at';
    let orderAscending = false;

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'Price: Low to High':
          orderColumn = 'price';
          orderAscending = true;
          break;
        case 'Price: High to Low':
          orderColumn = 'price';
          orderAscending = false;
          break;
        case 'Most Popular':
          orderColumn = 'views';
          orderAscending = false;
          break;
        case 'Most Saved':
          orderColumn = 'shares';
          orderAscending = false;
          break;
        case 'Newest':
        default:
          orderColumn = 'created_at';
          orderAscending = false;
          break;
      }
    }

    const { data: productsData, error } = await query.order(orderColumn, { ascending: orderAscending });
    
    if (error) {
      console.error('Error fetching public products:', error);
      return [];
    }

    if (!productsData || productsData.length === 0) return [];

    // Fetch profiles separately to avoid foreign key relationship errors
    const userIds = [...new Set(productsData.map(p => p.user_id))];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);

    const profilesMap = new Map((profilesData || []).map(p => [p.id, p]));

    return productsData.map(p => ({
      ...p,
      user: profilesMap.get(p.user_id) || null
    }));
  },

  async getProduct(id: string): Promise<Product | null> {
    const { data: productData, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    if (!productData) return null;

    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', productData.user_id).single();
    
    return {
      ...productData,
      user: profileData || null
    };
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
