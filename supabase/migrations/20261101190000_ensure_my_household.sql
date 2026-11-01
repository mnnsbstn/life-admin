-- Repair accounts that have auth but no household (e.g. trigger missing at sign-up)

create or replace function public.ensure_my_household()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  hid uuid;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  select hm.household_id
  into hid
  from public.household_members hm
  where hm.user_id = uid
  order by hm.joined_at asc nulls last
  limit 1;

  if hid is not null then
    return hid;
  end if;

  insert into public.profiles (id, email, display_name)
  select
    u.id,
    coalesce(u.email, ''),
    coalesce(
      nullif(trim(u.raw_user_meta_data ->> 'display_name'), ''),
      split_part(coalesce(u.email, 'user'), '@', 1)
    )
  from auth.users u
  where u.id = uid
  on conflict (id) do nothing;

  insert into public.households (name)
  values ('Mein Haushalt')
  returning id into hid;

  insert into public.household_members (household_id, user_id, role)
  values (hid, uid, 'owner');

  return hid;
end;
$$;

revoke all on function public.ensure_my_household() from public;
grant execute on function public.ensure_my_household() to authenticated;
