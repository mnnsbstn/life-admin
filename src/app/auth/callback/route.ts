import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  getSupabaseAnonKey,
  getSupabaseProjectUrl,
  isSupabaseEnvConfigured,
} from "@/lib/supabase/env";

function resolveRequestOrigin(request: Request): string {
  const url = new URL(request.url);
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    url.host;
  const proto =
    request.headers.get("x-forwarded-proto") ??
    url.protocol.replace(":", "") ??
    "https";
  return `${proto}://${host}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/today";
  const origin = resolveRequestOrigin(request);
  const redirectUrl = `${origin}${next}`;

  if (!code || !isSupabaseEnvConfigured()) {
    return NextResponse.redirect(redirectUrl);
  }

  const cookieStore = await cookies();
  const redirectResponse = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(
    getSupabaseProjectUrl()!,
    getSupabaseAnonKey()!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            redirectResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  await supabase.auth.exchangeCodeForSession(code);

  return redirectResponse;
}
