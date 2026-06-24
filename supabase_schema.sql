-- Run this once in the Supabase SQL Editor for your project.

create table if not exists links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null unique,
  long_url text not null,
  click_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table links enable row level security;

create policy "Users can view their own links"
  on links for select
  using (auth.uid() = user_id);

create policy "Users can insert their own links"
  on links for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own links"
  on links for update
  using (auth.uid() = user_id);
