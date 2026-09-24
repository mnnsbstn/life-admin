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
