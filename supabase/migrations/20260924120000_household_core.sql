-- Life Admin core schema (V0.2 prep)
-- Household-scoped entities with RLS via household_members

create extension if not exists "pgcrypto";

-- Profiles mirror auth.users (optional display data)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create type public.household_member_role as enum ('owner', 'member', 'viewer');

create table if not exists public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.household_member_role not null default 'member',
  joined_at timestamptz not null default now(),
  unique (household_id, user_id)
);

create type public.home_item_category as enum (
  'heating', 'electricity', 'water', 'internet', 'appliances', 'kitchen',
  'bathroom', 'smart_home', 'garden', 'renovation', 'other'
);

create table if not exists public.home_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  name text not null,
  category public.home_item_category not null,
  manufacturer text,
  model text,
  serial_number text,
  location text,
  purchase_date date,
  installation_date date,
  purchase_price_cents integer,
  currency text default 'EUR',
  warranty_ends_at date,
  last_maintenance_at date,
  next_maintenance_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.contract_category as enum (
  'electricity', 'internet', 'mobile', 'insurance', 'streaming',
  'membership', 'software', 'other'
);

create type public.payment_interval as enum ('monthly', 'quarterly', 'yearly', 'once');

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  name text not null,
  provider text not null,
  category public.contract_category not null,
  cost_cents integer,
  currency text default 'EUR',
  payment_interval public.payment_interval,
  start_date date,
  minimum_term_months integer,
  notice_period_days integer,
  next_cancellation_date date,
  auto_renewal boolean default true,
  contract_end_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.document_type as enum (
  'invoice', 'contract', 'manual', 'warranty', 'insurance',
  'certificate', 'receipt', 'other'
);

create type public.document_link_type as enum ('none', 'home_item', 'contract');

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  title text not null,
  document_type public.document_type not null,
  issued_at date,
  storage_path text,
  mime_type text,
  mock_file_name text,
  mock_file_size_bytes integer,
  link_type public.document_link_type not null default 'none',
  link_target_id uuid,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.reminder_priority as enum ('low', 'medium', 'high');
create type public.reminder_status as enum ('upcoming', 'due', 'completed');
create type public.reminder_link_type as enum ('standalone', 'home_item', 'contract');

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  title text not null,
  due_date date not null,
  status public.reminder_status not null default 'upcoming',
  priority public.reminder_priority not null default 'medium',
  link_type public.reminder_link_type not null default 'standalone',
  link_target_id uuid,
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists home_items_household_id_idx on public.home_items (household_id);
create index if not exists contracts_household_id_idx on public.contracts (household_id);
create index if not exists documents_household_id_idx on public.documents (household_id);
create index if not exists reminders_household_id_idx on public.reminders (household_id);
create index if not exists reminders_due_date_idx on public.reminders (due_date);

-- RLS
alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.home_items enable row level security;
alter table public.contracts enable row level security;
alter table public.documents enable row level security;
alter table public.reminders enable row level security;

-- Profiles: own row only
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- Households: members can read
create policy "households_select_member" on public.households
  for select using (
    id in (
      select household_id from public.household_members where user_id = auth.uid()
    )
  );

-- Household members: same household
create policy "household_members_select" on public.household_members
  for select using (
    household_id in (
      select household_id from public.household_members hm where hm.user_id = auth.uid()
    )
  );

-- Entity tables: household scoped
create policy "home_items_all_member" on public.home_items
  for all using (
    household_id in (
      select household_id from public.household_members where user_id = auth.uid()
    )
  )
  with check (
    household_id in (
      select household_id from public.household_members where user_id = auth.uid()
    )
  );

create policy "contracts_all_member" on public.contracts
  for all using (
    household_id in (
      select household_id from public.household_members where user_id = auth.uid()
    )
  )
  with check (
    household_id in (
      select household_id from public.household_members where user_id = auth.uid()
    )
  );

create policy "documents_all_member" on public.documents
  for all using (
    household_id in (
      select household_id from public.household_members where user_id = auth.uid()
    )
  )
  with check (
    household_id in (
      select household_id from public.household_members where user_id = auth.uid()
    )
  );

create policy "reminders_all_member" on public.reminders
  for all using (
    household_id in (
      select household_id from public.household_members where user_id = auth.uid()
    )
  )
  with check (
    household_id in (
      select household_id from public.household_members where user_id = auth.uid()
    )
  );
