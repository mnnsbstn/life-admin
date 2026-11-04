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
    redirect(
      `/login?error=${encodeURIComponent("Supabase ist nicht konfiguriert.")}&next=${encodeURIComponent(next)}`,
    );
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(formatAuthError(error.message))}&next=${encodeURIComponent(next)}`,
    );
  }

  redirect(next);
}

function formatAuthError(message: string): string {
  if (/email not confirmed/i.test(message)) {
    return (
      "E-Mail noch nicht bestätigt. Prüfe Postfach und Spam. " +
      "Kommt keine Mail, ist die Bestätigung in Supabase noch aktiv — siehe docs/DEINE-LIVE-URL.md (Confirm email für V1 ausschalten)."
    );
  }
  if (/invalid api key/i.test(message)) {
    return `${message} — ${getSupabaseEnvHint()}. In Vercel: anon-Key von Projekt oxnyvzsvrvnncorsgyjo (Settings → API), nicht service_role.`;
  }
  if (/invalid path|requested path is invalid/i.test(message)) {
    return (
      "Supabase-URL in Vercel ist falsch (Browser-Link oder Pfad wie /settings/api). " +
      "Setze NEXT_PUBLIC_SUPABASE_URL exakt auf https://oxnyvzsvrvnncorsgyjo.supabase.co — nur diese Zeile, ohne weiteren Pfad. " +
      getSupabaseEnvHint()
    );
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
    redirect(
      `/login?error=${encodeURIComponent("Supabase ist nicht konfiguriert.")}&next=${encodeURIComponent(next)}`,
    );
  }

  const { data, error } = await supabase.auth.signUp({
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

  if (data.session) {
    redirect(next);
  }

  redirect(
    `/login?info=${encodeURIComponent(
      "Konto angelegt. Bitte bestätige deine E-Mail und melde dich dann an.",
    )}&next=${encodeURIComponent(next)}`,
  );
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
