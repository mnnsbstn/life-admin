export type DataSourceMode = "mock" | "supabase";

export function getConfiguredDataSource(): DataSourceMode {
  const value = process.env.NEXT_PUBLIC_DATA_SOURCE?.toLowerCase();
  return value === "supabase" ? "supabase" : "mock";
}

export function isSupabaseEnvConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export type RuntimeDataBackend =
  | "mock"
  | "supabase-configured"
  | "supabase-missing-env";

/** Effective backend for UI/diagnostics (Auth wiring still required for live Supabase). */
export function getRuntimeDataBackend(): RuntimeDataBackend {
  if (getConfiguredDataSource() !== "supabase") {
    return "mock";
  }
  if (!isSupabaseEnvConfigured()) {
    return "supabase-missing-env";
  }
  return "supabase-configured";
}
