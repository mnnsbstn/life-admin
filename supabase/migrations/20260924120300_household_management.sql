-- Household rename, invitations, accept flow (V0.2)

create table if not exists public.household_invitations (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  email text not null,
  role public.household_member_role not null default 'member',
  token text not null unique default replace(
    gen_random_uuid()::text || gen_random_uuid()::text,
    '-',
    ''
  ),
  created_by uuid not null references auth.users (id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  constraint household_invitations_role_not_owner check (role <> 'owner')
);

create index if not exists household_invitations_household_id_idx
  on public.household_invitations (household_id);

alter table public.household_invitations enable row level security;

create policy "households_update_owner" on public.households
  for update
  using (
    id in (
      select household_id
      from public.household_members
      where user_id = auth.uid() and role = 'owner'
    )
  )
  with check (
    id in (
      select household_id
      from public.household_members
      where user_id = auth.uid() and role = 'owner'
    )
  );

create policy "household_invitations_select_owner" on public.household_invitations
  for select
  using (
    household_id in (
      select household_id
      from public.household_members
      where user_id = auth.uid() and role = 'owner'
    )
  );

create policy "household_invitations_select_invitee" on public.household_invitations
  for select
  using (
    accepted_at is null
    and expires_at > now()
    and lower(email) = lower(
      (select email from public.profiles where id = auth.uid())
    )
  );

create policy "household_invitations_insert_owner" on public.household_invitations
  for insert
  with check (
    created_by = auth.uid()
    and household_id in (
      select household_id
      from public.household_members
      where user_id = auth.uid() and role = 'owner'
    )
  );

create policy "household_invitations_delete_owner" on public.household_invitations
  for delete
  using (
    household_id in (
      select household_id
      from public.household_members
      where user_id = auth.uid() and role = 'owner'
    )
  );

create or replace function public.accept_household_invitation(invite_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inv public.household_invitations%rowtype;
  uid uuid := auth.uid();
  user_email text;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select email into user_email from public.profiles where id = uid;
  if user_email is null then
    raise exception 'Profile not found';
  end if;

  select * into inv
  from public.household_invitations
  where token = invite_token
    and accepted_at is null
    and expires_at > now();

  if not found then
    raise exception 'Invalid or expired invitation';
  end if;

  if lower(inv.email) <> lower(user_email) then
    raise exception 'Invitation email does not match your account';
  end if;

  insert into public.household_members (household_id, user_id, role)
  values (inv.household_id, uid, inv.role)
  on conflict (household_id, user_id) do update set role = excluded.role;

  update public.household_invitations
  set accepted_at = now()
  where id = inv.id;

  return inv.household_id;
end;
$$;

grant execute on function public.accept_household_invitation(text) to authenticated;

-- Allow household peers to read profile display data (member list)
create policy "profiles_select_household_peer" on public.profiles
  for select
  using (
    id in (
      select hm.user_id
      from public.household_members hm
      where hm.household_id in (
        select household_id
        from public.household_members
        where user_id = auth.uid()
      )
    )
  );
