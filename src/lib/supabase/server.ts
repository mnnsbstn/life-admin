import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { isSupabaseEnvConfigured } from "@/lib/supabase/env";

export async function createSupabaseServerClient() {
  if (!isSupabaseEnvConfigured()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
            // Called from a Server Component — cookie writes happen in middleware/route handlers.
          }
        },
      },
    },
  );
}
