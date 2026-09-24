# Supabase repositories (V0.2)

Implement repositories here using `createSupabaseServerClient()`.

**Done:** `home_items`, `contracts` (+ user/household via auth).

**Todo:** `documents`, `reminders`, Storage.

Map DB rows (snake_case) ↔ domain types (`src/lib/domain/types.ts`).

Do not use service role keys in this layer — rely on authenticated user sessions and RLS.
