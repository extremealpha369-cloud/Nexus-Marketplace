-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  avatar_url text,
  role text default 'buyer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS
create table products (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric not null,
  category text not null,
  thumbnail text,
  reference_images text[], -- Array of URLs
  visibility text default 'public', -- 'public' or 'private'
  tags text[],
  brand text,
  condition text,
  returns text,
  shipping_price numeric default 0,
  contact_number text,
  email text,
  country text,
  state text,
  city text,
  views integer default 0,
  shares integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- REVIEWS
create table reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  text text,
  reply_text text,
  replied_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- FAVOURITES
create table favourites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  notes text,
  priority text default 'medium', -- 'high', 'medium', 'low'
  notify_on_drop boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- ORDERS
create table orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  status text default 'Processing', -- 'Processing', 'Shipped', 'Delivered', 'Cancelled'
  total numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- STORAGE BUCKETS
-- Note: You need to create a bucket named 'products' in the Supabase dashboard.
-- Policy to allow authenticated uploads:
-- create policy "Allow authenticated uploads" on storage.objects for insert with check (bucket_id = 'products' and auth.role() = 'authenticated');
-- Policy to allow public viewing:
-- create policy "Allow public viewing" on storage.objects for select using (bucket_id = 'products');

-- RLS POLICIES

-- Profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Products
alter table products enable row level security;
create policy "Public products are viewable by everyone" on products for select using (visibility = 'public' or auth.uid() = user_id);
create policy "Users can insert their own products" on products for insert with check (auth.uid() = user_id);
create policy "Users can update their own products" on products for update using (auth.uid() = user_id);
create policy "Users can delete their own products" on products for delete using (auth.uid() = user_id);

-- Reviews
alter table reviews enable row level security;
create policy "Reviews are viewable by everyone" on reviews for select using (true);
create policy "Authenticated users can insert reviews" on reviews for insert with check (auth.role() = 'authenticated');
create policy "Users can update their own reviews" on reviews for update using (auth.uid() = user_id);
create policy "Sellers can reply to reviews on their products" on reviews for update using (
  exists (select 1 from products where products.id = reviews.product_id and products.user_id = auth.uid())
);

-- Favourites
alter table favourites enable row level security;
create policy "Users can view their own favourites" on favourites for select using (auth.uid() = user_id);
create policy "Users can insert their own favourites" on favourites for insert with check (auth.uid() = user_id);
create policy "Users can update their own favourites" on favourites for update using (auth.uid() = user_id);
create policy "Users can delete their own favourites" on favourites for delete using (auth.uid() = user_id);

-- Orders
alter table orders enable row level security;
create policy "Users can view their own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can insert their own orders" on orders for insert with check (auth.uid() = user_id);
