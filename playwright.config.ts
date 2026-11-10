import { defineConfig, devices } from "@playwright/test";

const supabaseE2E =
  process.env.E2E_DATA_SOURCE === "supabase" &&
  Boolean(process.env.E2E_SUPABASE_URL) &&
  Boolean(process.env.E2E_SUPABASE_ANON_KEY);

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  projects: [
    {
      name: "mock",
      testMatch: /mock-.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "supabase",
      testMatch: /supabase-.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000/today",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: supabaseE2E
      ? {
          NEXT_PUBLIC_DATA_SOURCE: "supabase",
          NEXT_PUBLIC_SUPABASE_URL: process.env.E2E_SUPABASE_URL!,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.E2E_SUPABASE_ANON_KEY!,
        }
      : {
          NEXT_PUBLIC_DATA_SOURCE: "mock",
        },
  },
});
