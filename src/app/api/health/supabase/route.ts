import { NextResponse } from "next/server";

import {
  getSupabaseAnonKey,
  getSupabaseProjectUrl,
  isSupabaseEnvConfigured,
} from "@/lib/supabase/env";

function keyKind(key: string | undefined): string {
  if (!key) return "missing";
  if (key.startsWith("eyJ")) return "anon-jwt";
  if (key.startsWith("sb_publishable_")) return "publishable";
  if (key.startsWith("sb_secret_")) return "secret-not-allowed";
  return "unknown";
}

/** Read-only check: env + Supabase Auth API accepts the configured anon key. */
export async function GET() {
  if (!isSupabaseEnvConfigured()) {
    return NextResponse.json({
      ok: false,
      reason: "env-missing",
      urlHost: null,
      keyKind: keyKind(getSupabaseAnonKey()),
    });
  }

  const url = getSupabaseProjectUrl()!;
  const key = getSupabaseAnonKey()!;
  let urlHost: string | null = null;
  try {
    urlHost = new URL(url).host;
  } catch {
    return NextResponse.json({
      ok: false,
      reason: "invalid-url",
      urlHost: null,
      keyKind: keyKind(key),
    });
  }

  const res = await fetch(`${url.replace(/\/$/, "")}/auth/v1/settings`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    return NextResponse.json({
      ok: false,
      reason: "invalid-api-key",
      urlHost,
      keyKind: keyKind(key),
      status: res.status,
      hint: body.slice(0, 120),
    });
  }

  return NextResponse.json({
    ok: true,
    urlHost,
    keyKind: keyKind(key),
  });
}
