-- Create product_reviews table
create table if not exists product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  reviewer_id uuid references profiles(id) on delete cascade,
  reviewer_email text not null,
  product_owner_id uuid references profiles(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  review_text text not null,
  created_at timestamp with time zone default now()
);

-- Create review_replies table
create table if not exists review_replies (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references product_reviews(id) on delete cascade,
  owner_id uuid references profiles(id) on delete cascade,
  reply_text text not null,
  replied_at timestamp with time zone default now()
);

-- Enable RLS
alter table product_reviews enable row level security;
alter table review_replies enable row level security;

-- Policies for product_reviews

-- Allow anyone to read reviews (public)
create policy "Reviews are public"
  on product_reviews for select
  using (true);

-- Allow authenticated users to insert reviews
create policy "Authenticated users can insert reviews"
  on product_reviews for insert
  with check (auth.uid() = reviewer_id);

-- Allow reviewers to update their own reviews
create policy "Reviewers can update their own reviews"
  on product_reviews for update
  using (auth.uid() = reviewer_id);

-- Allow reviewers to delete their own reviews
create policy "Reviewers can delete their own reviews"
  on product_reviews for delete
  using (auth.uid() = reviewer_id);

-- Policies for review_replies

-- Allow anyone to read replies (public)
create policy "Replies are public"
  on review_replies for select
  using (true);

-- Allow product owners to insert replies
-- We need to check if the user is the owner of the product associated with the review
-- This requires a join or a subquery. For simplicity and performance in RLS, 
-- we often rely on the application to set the correct owner_id, 
-- but strictly we should check against the product_reviews -> product_owner_id.

create policy "Product owners can insert replies"
  on review_replies for insert
  with check (
    auth.uid() = owner_id and
    exists (
      select 1 from product_reviews
      where product_reviews.id = review_id
      and product_reviews.product_owner_id = auth.uid()
    )
  );

-- Allow product owners to update their own replies
create policy "Product owners can update their own replies"
  on review_replies for update
  using (auth.uid() = owner_id);

-- Allow product owners to delete their own replies
create policy "Product owners can delete their own replies"
  on review_replies for delete
  using (auth.uid() = owner_id);
