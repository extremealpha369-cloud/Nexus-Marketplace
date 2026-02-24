export type Category = "Tech" | "Property" | "Entertainment" | "Fashion" | "Automotive";
export type Condition = "New" | "Like New" | "Good" | "Used" | "Digital";

export interface Profile {
  id: string;
  name: string;
  avatar_url: string;
  role: 'buyer' | 'seller';
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  reference_images: string[];
  visibility: 'public' | 'private';
  tags: string[];
  brand: string;
  condition: string;
  returns: string;
  shipping_price: number;
  contact_number: string;
  email: string;
  country: string;
  state: string;
  city: string;
  views: number;
  shares: number;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  text: string;
  reply_text?: string;
  replied_at?: string;
  created_at: string;
  user?: Profile; // Joined data
  product?: Partial<Product>; // Joined data
}

export interface Favourite {
  id: string;
  user_id: string;
  product_id: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
  notify_on_drop: boolean;
  created_at: string;
  product?: Product; // Joined data
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  created_at: string;
  product?: Product; // Joined data
}

export interface ProductFormData {
  name: string;
  description: string;
  thumbnail: string;
  referenceImages: string[];
  contactNumber: string;
  email: string;
  price: string;
  country: string;
  state: string;
  city: string;
  tags: string[];
  category: string;
  brand: string;
  condition: string;
  returns: string;
  visibility: 'public' | 'private';
}
