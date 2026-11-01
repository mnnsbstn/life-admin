export type DataSourceMode = "mock" | "supabase";

function trimEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function getSupabaseProjectUrl(): string | undefined {
  return (
    trimEnv(process.env.SUPABASE_URL) ??
    trimEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)
  );
}

export function getSupabaseAnonKey(): string | undefined {
  return (
    trimEnv(process.env.SUPABASE_ANON_KEY) ??
    trimEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

/** Safe hint for login errors (host only, no secrets). */
export function getSupabaseEnvHint(): string {
  const url = getSupabaseProjectUrl();
  if (!url) return "Supabase-URL fehlt in Vercel (NEXT_PUBLIC_SUPABASE_URL).";
  try {
    return `Supabase-Host: ${new URL(url).host}`;
  } catch {
    return "Supabase-URL ist ungültig.";
  }
}

export function getConfiguredDataSource(): DataSourceMode {
  const value = trimEnv(process.env.NEXT_PUBLIC_DATA_SOURCE)?.toLowerCase();
  return value === "supabase" ? "supabase" : "mock";
}

export function isSupabaseEnvConfigured(): boolean {
  return Boolean(getSupabaseProjectUrl() && getSupabaseAnonKey());
}

export function shouldUseSupabaseBackend(): boolean {
  return getConfiguredDataSource() === "supabase" && isSupabaseEnvConfigured();
}

export type RuntimeDataBackend =
  | "mock"
  | "supabase-full"
  | "supabase-missing-env";

/** Effective backend for UI/diagnostics */
export function getRuntimeDataBackend(): RuntimeDataBackend {
  if (getConfiguredDataSource() !== "supabase") {
    return "mock";
  }
  if (!isSupabaseEnvConfigured()) {
    return "supabase-missing-env";
  }
  return "supabase-full";
}

export function getRuntimeDataBackendLabel(): string {
  switch (getRuntimeDataBackend()) {
    case "mock":
      return "Mock (In-Memory)";
    case "supabase-full":
      return "Supabase (alle Module + Storage)";
    case "supabase-missing-env":
      return "Supabase (Env unvollständig)";
  }
}
