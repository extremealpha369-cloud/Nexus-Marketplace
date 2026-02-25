insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;


create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'products' );


create policy "Authenticated users can upload"
on storage.objects for insert
with check ( bucket_id = 'products' and auth.role() = 'authenticated' );


create policy "Users can update their own images"
on storage.objects for update
using ( bucket_id = 'products' and auth.uid() = owner );


create policy "Users can delete their own images"
on storage.objects for delete
using ( bucket_id = 'products' and auth.uid() = owner );