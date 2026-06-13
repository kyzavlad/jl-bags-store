-- JL Bags Store — initial schema
-- Run in the Supabase SQL editor (or via the Supabase CLI) on a fresh project.

create extension if not exists "pgcrypto";

-- ─── products ────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,
  name          text not null default '',
  description   text default '',
  material      text default '',
  size_text     text default '',
  category      text default '',
  price_retail  numeric not null default 0,
  price_drop    numeric not null default 0,
  is_active     boolean not null default true,
  stock_status  text not null default 'out_of_stock'
                  check (stock_status in ('in_stock', 'out_of_stock')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists products_code_idx         on public.products (code);
create index if not exists products_stock_status_idx on public.products (stock_status);
create index if not exists products_is_active_idx    on public.products (is_active);

-- ─── product_variants ────────────────────────────────────────────────────────
create table if not exists public.product_variants (
  id                    uuid primary key default gen_random_uuid(),
  product_id            uuid not null references public.products (id) on delete cascade,
  color                 text not null default '—',
  quantity              integer not null default 0,
  reserved_quantity     integer not null default 0,
  source_text           text,
  normalized_source_key text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists variants_product_id_idx on public.product_variants (product_id);
create index if not exists variants_norm_key_idx   on public.product_variants (product_id, normalized_source_key);

-- ─── product_photos ──────────────────────────────────────────────────────────
create table if not exists public.product_photos (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products (id) on delete cascade,
  url         text not null,
  is_primary  boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists photos_product_id_idx on public.product_photos (product_id);

-- ─── store_settings (single row, id = 1) ─────────────────────────────────────
create table if not exists public.store_settings (
  id            integer primary key default 1 check (id = 1),
  store_name    text not null default 'JL Bags',
  contact_email text default '',
  contact_phone text default '',
  currency      text not null default 'грн',
  updated_at    timestamptz not null default now()
);

insert into public.store_settings (id) values (1)
  on conflict (id) do nothing;

-- ─── orders (optional, minimal) ──────────────────────────────────────────────
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  customer_name   text default '',
  customer_phone  text default '',
  customer_email  text default '',
  items           jsonb not null default '[]'::jsonb,
  total           numeric not null default 0,
  status          text not null default 'new',
  note            text default '',
  created_at      timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);

-- ─── updated_at trigger ──────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists variants_updated_at on public.product_variants;
create trigger variants_updated_at before update on public.product_variants
  for each row execute function public.set_updated_at();

-- ─── Row Level Security ──────────────────────────────────────────────────────
-- The app talks to these tables only through the service-role key on the server
-- (which bypasses RLS). We enable RLS with no public policies so the anon key
-- cannot read/write directly. Admin auth is verified server-side.
alter table public.products         enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_photos   enable row level security;
alter table public.store_settings   enable row level security;
alter table public.orders           enable row level security;
