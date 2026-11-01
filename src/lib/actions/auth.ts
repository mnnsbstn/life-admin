"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getSupabaseEnvHint,
  shouldUseSupabaseBackend,
} from "@/lib/supabase/env";

export async function signInAction(formData: FormData) {
  if (!shouldUseSupabaseBackend()) {
    redirect("/today");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/today");

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(formatAuthError(error.message))}&next=${encodeURIComponent(next)}`,
    );
  }

  redirect(next);
}

function formatAuthError(message: string): string {
  if (/invalid api key/i.test(message)) {
    return `${message} — ${getSupabaseEnvHint()}. In Vercel: anon-Key von Projekt oxnyvzsvrvnncorsgyjo (Settings → API), nicht service_role.`;
  }
  return message;
}

export async function signUpAction(formData: FormData) {
  if (!shouldUseSupabaseBackend()) {
    redirect("/today");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  const next = String(formData.get("next") ?? "/today");

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: displayName ? { display_name: displayName } : undefined,
    },
  });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(formatAuthError(error.message))}&next=${encodeURIComponent(next)}`,
    );
  }

  redirect(next);
}

export async function signOutAction() {
  if (shouldUseSupabaseBackend()) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  }
  redirect("/login");
}
