import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";
import { isStaticExportBuild } from "@/lib/deployment-mode";
import { shouldUseSupabaseBackend } from "@/lib/supabase/env";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Anmelden",
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string; info?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (!shouldUseSupabaseBackend()) {
    redirect("/today");
  }

  const { next, error, info } = isStaticExportBuild()
    ? {}
    : await searchParams;

  return (
    <LoginForm
      nextPath={next ?? "/today"}
      errorMessage={error ? decodeURIComponent(error) : undefined}
      infoMessage={info ? decodeURIComponent(info) : undefined}
    />
  );
}
