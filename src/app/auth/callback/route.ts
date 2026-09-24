import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  if (code) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
