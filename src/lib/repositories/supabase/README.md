# Supabase repositories (V0.2)

Implement repositories here using `createSupabaseServerClient()`.

**Done:** `home_items`, `contracts`, `reminders`, `documents` (+ user/household via auth).

**Storage:** private bucket `life-admin-documents` — see `src/lib/supabase/storage/documents.ts` and migration `20260924120200_documents_storage.sql`.

Map DB rows (snake_case) ↔ domain types (`src/lib/domain/types.ts`).

Do not use service role keys in this layer — rely on authenticated user sessions and RLS.
