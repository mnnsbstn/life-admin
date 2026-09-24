-- Private bucket for household document files
-- Path convention: {household_id}/{document_id}/{filename}

insert into storage.buckets (id, name, public, file_size_limit)
values ('life-admin-documents', 'life-admin-documents', false, 52428800)
on conflict (id) do nothing;

-- SELECT (required for signed URLs / downloads with RLS)
create policy "life_admin_documents_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'life-admin-documents'
  and (storage.foldername(name))[1]::uuid in (
    select household_id from public.household_members where user_id = auth.uid()
  )
);

create policy "life_admin_documents_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'life-admin-documents'
  and (storage.foldername(name))[1]::uuid in (
    select household_id from public.household_members where user_id = auth.uid()
  )
);

create policy "life_admin_documents_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'life-admin-documents'
  and (storage.foldername(name))[1]::uuid in (
    select household_id from public.household_members where user_id = auth.uid()
  )
)
with check (
  bucket_id = 'life-admin-documents'
  and (storage.foldername(name))[1]::uuid in (
    select household_id from public.household_members where user_id = auth.uid()
  )
);

create policy "life_admin_documents_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'life-admin-documents'
  and (storage.foldername(name))[1]::uuid in (
    select household_id from public.household_members where user_id = auth.uid()
  )
);
