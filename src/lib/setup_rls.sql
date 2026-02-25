-- Enable RLS on tables if not already enabled
alter table products enable row level security;
alter table profiles enable row level security;

-- Policy to allow everyone to view public products
create policy "Public products are visible to everyone"
on products for select
using ( visibility = 'public' );

-- Policy to allow users to view their own products (even if private)
create policy "Users can view their own products"
on products for select
using ( auth.uid() = user_id );

-- Policy to allow users to insert their own products
create policy "Users can insert their own products"
on products for insert
with check ( auth.uid() = user_id );

-- Policy to allow users to update their own products
create policy "Users can update their own products"
on products for update
using ( auth.uid() = user_id );

-- Policy to allow users to delete their own products
create policy "Users can delete their own products"
on products for delete
using ( auth.uid() = user_id );

-- Policy to allow everyone to view profiles (needed for seller info)
create policy "Public profiles are visible to everyone"
on profiles for select
using ( true );

-- Policy to allow users to update their own profile
create policy "Users can update their own profile"
on profiles for update
using ( auth.uid() = id );
