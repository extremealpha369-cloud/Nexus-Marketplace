-- Run this in your Supabase SQL Editor to create the products table

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  reference_images JSONB DEFAULT '[]'::jsonb,
  contact_number TEXT,
  email TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  country TEXT,
  state TEXT,
  city TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  brand TEXT,
  condition TEXT,
  returns TEXT,
  visibility TEXT DEFAULT 'private',
  share_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Policy: Users can view public products
CREATE POLICY "Anyone can view public products"
  ON public.products
  FOR SELECT
  USING (visibility = 'public');

-- Policy: Users can view their own products (even if private)
CREATE POLICY "Users can view their own products"
  ON public.products
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own products
CREATE POLICY "Users can insert their own products"
  ON public.products
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own products
CREATE POLICY "Users can update their own products"
  ON public.products
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own products
CREATE POLICY "Users can delete their own products"
  ON public.products
  FOR DELETE
  USING (auth.uid() = user_id);
