create policy "Recipes can only viewed by owner"
  on recipes for select
  using ( user_id = auth.uid() );

create policy "Owner can create their own recipes"
  on recipes for insert
  with check ( auth.uid() = user_id );

create policy "Owner can update their own recipes"
  on recipes for update
  using ( auth.uid() = user_id );
