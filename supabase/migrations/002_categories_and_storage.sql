-- JL Bags Store — categories + product photo storage
-- Run AFTER 001_init.sql, in the Supabase SQL editor (or via the Supabase CLI).
-- Idempotent and non-destructive: safe to run more than once.

-- ─── categories ──────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists categories_sort_idx      on public.categories (sort_order);
create index if not exists categories_is_active_idx on public.categories (is_active);

-- updated_at trigger (function defined in 001_init.sql)
drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

alter table public.categories enable row level security;

-- ─── products.category_id (keep existing text `category` column intact) ──────
-- The text `category` column from 001 is preserved. We add a clean FK reference
-- and keep the text column denormalized (category name) so nothing that reads
-- `category` breaks. Sync never writes either column.
alter table public.products
  add column if not exists category_id uuid references public.categories (id) on delete set null;

create index if not exists products_category_id_idx on public.products (category_id);

-- ─── seed default categories (only if missing) ───────────────────────────────
insert into public.categories (name, slug, sort_order) values
  ('Сумочки для телефона', 'phone-bags',     1),
  ('Замшевые сумки',       'suede-bags',     2),
  ('Кожаные сумки',        'leather-bags',   3),
  ('Сумки через плечо',    'crossbody-bags', 4),
  ('Шопперы',              'shoppers',       5),
  ('Рюкзаки',              'backpacks',      6),
  ('Аксессуары',           'accessories',    7)
on conflict (slug) do nothing;

-- ─── Backfill category_id from existing text category values ─────────────────
-- For products that already have a text category matching a seeded/known
-- category name, link them up. Leaves unmatched text categories untouched.
update public.products p
set category_id = c.id
from public.categories c
where p.category_id is null
  and p.category is not null
  and btrim(lower(p.category)) = btrim(lower(c.name));

-- ─── Storage bucket for product photos ───────────────────────────────────────
-- Public-read bucket. Uploads happen server-side through the service-role key
-- (which bypasses RLS), so no INSERT policy for anon/authenticated is needed.
-- If your project blocks inserting into storage.buckets from the SQL editor,
-- create the bucket from the Dashboard instead (see README) — the app degrades
-- gracefully with a clear error if the bucket is missing.
insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do update set public = true;

-- Public read access for objects in the product-photos bucket.
drop policy if exists "Public read product-photos" on storage.objects;
create policy "Public read product-photos"
  on storage.objects for select
  using (bucket_id = 'product-photos');
