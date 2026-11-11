-- Per-user calendar OAuth (Google) + sync idempotency

create type public.calendar_provider as enum ('google');

create table if not exists public.user_calendar_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider public.calendar_provider not null,
  account_email text,
  refresh_token text not null,
  access_token text,
  access_token_expires_at timestamptz,
  calendar_id text not null default 'primary',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

create table if not exists public.calendar_synced_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider public.calendar_provider not null,
  source_kind text not null,
  source_id text not null,
  external_event_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, provider, source_kind, source_id)
);

alter table public.user_calendar_connections enable row level security;
alter table public.calendar_synced_events enable row level security;

create policy "calendar_connections_own" on public.user_calendar_connections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "calendar_synced_events_own" on public.calendar_synced_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
