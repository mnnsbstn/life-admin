import { createClient } from "@supabase/supabase-js";

import { getSupabaseProjectUrl } from "@/lib/supabase/env";

/** Server-only client for token-guarded routes (never expose to the browser). */
export function createSupabaseAdminClient() {
  const url = getSupabaseProjectUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isSupabaseServiceRoleConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}
