import { supabase } from '../lib/supabase';
import { Favourite } from '../types';

export const favouriteService = {
  async getFavourites(userId: string): Promise<Favourite[]> {
    const { data: favData, error } = await supabase
      .from('favourites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!favData || favData.length === 0) return [];

    // Fetch products separately
    const productIds = [...new Set(favData.map(f => f.product_id))];
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    const productsMap = new Map((productsData || []).map(p => [p.id, p]));

    // Fetch profiles (sellers) separately
    const sellerIds = [...new Set((productsData || []).map(p => p.user_id))];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .in('id', sellerIds);

    const profilesMap = new Map((profilesData || []).map(p => [p.id, p]));

    return favData.map(f => {
      const product = productsMap.get(f.product_id);
      if (product) {
        product.user = profilesMap.get(product.user_id) || null;
      }
      return {
        ...f,
        product: product || null
      };
    });
  },

  async addFavourite(userId: string, productId: string): Promise<Favourite> {
    const { data: favData, error } = await supabase
      .from('favourites')
      .insert({ user_id: userId, product_id: productId })
      .select('*')
      .single();

    if (error) throw error;

    // Fetch product separately
    const { data: productData } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productData) {
      // Fetch profile (seller) separately
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', productData.user_id)
        .single();
      
      productData.user = profileData || null;
    }

    return {
      ...favData,
      product: productData || null
    };
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
