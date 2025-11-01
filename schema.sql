-- === schema_and_policies.sql (fixed for Supabase) ===
-- Safe to run: creates extensions, tables, enables RLS, and defines policies

-- 1) Extensions
create extension if not exists "pgcrypto";

-- 2) Tables
create table if not exists villages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  state text,
  district text,
  population integer,
  latitude double precision,
  longitude double precision,
  description text,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text,
  phone text,
  village text,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  village_id uuid references villages(id) on delete set null,
  owner_id uuid references profiles(id) on delete set null,
  name text not null,
  category text,
  latitude double precision,
  longitude double precision,
  address text,
  phone text,
  image_url text,
  opening_hours text,
  verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  action text not null,
  details jsonb,
  created_at timestamptz default now()
);

create table if not exists ai_content (
  id uuid primary key default gen_random_uuid(),
  entity_type text,
  entity_id uuid,
  prompt_type text,
  language text,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3) Indexes
create index if not exists businesses_lat_lng_idx on businesses(latitude, longitude);
create index if not exists villages_lat_lng_idx on villages(latitude, longitude);

-- 4) Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table businesses enable row level security;
alter table history enable row level security;
alter table villages enable row level security;
alter table ai_content enable row level security;

-- 5) Policies

-- === Public SELECT Policies ===
drop policy if exists public_read_villages on villages;
create policy public_read_villages
on villages for select using (true);

drop policy if exists public_read_businesses on businesses;
create policy public_read_businesses
on businesses for select using (true);

drop policy if exists public_read_ai_content on ai_content;
create policy public_read_ai_content
on ai_content for select using (true);

drop policy if exists profiles_select_public on profiles;
create policy profiles_select_public
on profiles for select using (true);

-- === INSERT Policies (authenticated users only) ===
drop policy if exists profiles_insert_for_authenticated on profiles;
create policy profiles_insert_for_authenticated
on profiles for insert
with check (auth.role() = 'authenticated');

drop policy if exists businesses_insert_owner on businesses;
create policy businesses_insert_owner
on businesses for insert
with check (auth.uid()::uuid = owner_id);

drop policy if exists history_insert_own on history;
create policy history_insert_own
on history for insert
with check (auth.uid()::uuid = user_id);

-- === UPDATE Policies ===
drop policy if exists profiles_update_own on profiles;
create policy profiles_update_own
on profiles for update
using (auth.uid()::uuid = id);

drop policy if exists businesses_update_owner on businesses;
create policy businesses_update_owner
on businesses for update
using (auth.uid()::uuid = owner_id);

-- === DELETE Policies ===
drop policy if exists businesses_delete_owner on businesses;
create policy businesses_delete_owner
on businesses for delete
using (auth.uid()::uuid = owner_id);

-- Done
