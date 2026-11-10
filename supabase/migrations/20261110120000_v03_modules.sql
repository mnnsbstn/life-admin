-- V0.3 modules: vehicles, financial_accounts, family_members

create type public.vehicle_kind as enum (
  'car', 'motorcycle', 'bicycle', 'camper', 'other'
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  name text not null,
  kind public.vehicle_kind not null,
  make text,
  model text,
  license_plate text,
  year integer,
  next_inspection_at date,
  insurance_ends_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.financial_account_type as enum (
  'checking', 'savings', 'investment', 'credit', 'cash', 'other'
);

create table if not exists public.financial_accounts (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  name text not null,
  account_type public.financial_account_type not null,
  institution text,
  iban_last4 text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.family_relationship as enum (
  'partner', 'child', 'parent', 'sibling', 'relative', 'friend', 'other'
);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  name text not null,
  relationship public.family_relationship not null,
  email text,
  phone text,
  birthday date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vehicles_household_id_idx on public.vehicles (household_id);
create index if not exists financial_accounts_household_id_idx on public.financial_accounts (household_id);
create index if not exists family_members_household_id_idx on public.family_members (household_id);

alter table public.vehicles enable row level security;
alter table public.financial_accounts enable row level security;
alter table public.family_members enable row level security;

create policy "vehicles_all_member" on public.vehicles
  for all
  using (household_id in (select public.user_household_ids()))
  with check (household_id in (select public.user_household_ids()));

create policy "financial_accounts_all_member" on public.financial_accounts
  for all
  using (household_id in (select public.user_household_ids()))
  with check (household_id in (select public.user_household_ids()));

create policy "family_members_all_member" on public.family_members
  for all
  using (household_id in (select public.user_household_ids()))
  with check (household_id in (select public.user_household_ids()));
