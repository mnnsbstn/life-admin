"use client";

import { createBrowserClient } from "@supabase/ssr";

import {
  getSupabaseAnonKey,
  getSupabaseProjectUrl,
  isSupabaseEnvConfigured,
} from "@/lib/supabase/env";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  if (!isSupabaseEnvConfigured()) {
    return null;
  }

  if (!client) {
    client = createBrowserClient(
      getSupabaseProjectUrl()!,
      getSupabaseAnonKey()!,
    );
  }

  return client;
}
