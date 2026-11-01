import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  getSupabaseAnonKey,
  getSupabaseProjectUrl,
  isSupabaseEnvConfigured,
} from "@/lib/supabase/env";

export async function createSupabaseServerClient() {
  if (!isSupabaseEnvConfigured()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    getSupabaseProjectUrl()!,
    getSupabaseAnonKey()!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — cookie writes happen in proxy/route handlers.
          }
        },
      },
    },
  );
}
