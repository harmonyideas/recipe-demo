-- Create storage bucket
insert into storage.buckets (id, name)
values ('recipe_images', 'recipe_images');

-- Create bucket policies
-- Policy that allows any authenticated user to view all recipe images
create policy "Any authenticated user can view recipe images"
  on storage.objects for select
  using ( bucket_id = 'recipe_images' );

-- Policy that allows the user that creates a recipe to upload an image for the recipe
create policy "User can upload their own recipe image"
  on storage.objects for insert
  with check ( 
    bucket_id = 'recipe_images'
    and auth.uid() = owner
  );

-- Policy that allows the user that first uploaded an image (owner) to update the image
create policy "User can update their own recipe image"
  on storage.objects for update
  using (
    bucket_id = 'recipe_images'
    and auth.uid() = owner
  );