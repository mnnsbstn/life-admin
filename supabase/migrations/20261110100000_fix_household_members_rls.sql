-- Fix infinite recursion: household_members SELECT must not subquery household_members under RLS.

create or replace function public.user_household_ids()
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
  select household_id from public.household_members where user_id = auth.uid();
$$;

revoke all on function public.user_household_ids() from public;
grant execute on function public.user_household_ids() to authenticated, anon;

drop policy if exists "household_members_select" on public.household_members;

create policy "household_members_select" on public.household_members
  for select
  using (household_id in (select public.user_household_ids()));
