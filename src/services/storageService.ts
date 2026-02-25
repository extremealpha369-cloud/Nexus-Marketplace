import { supabase } from '../lib/supabase';

export const storageService = {
  async uploadImage(file: File, bucket: string = 'products'): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes("Bucket not found")) {
          throw new Error(`Bucket '${bucket}' not found. Please run the SQL in src/lib/storage_setup.sql in your Supabase SQL Editor.`);
        }
        throw uploadError;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  async deleteImage(path: string, bucket: string = 'products'): Promise<void> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
};
