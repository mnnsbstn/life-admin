# E2E tests (Playwright)

End-to-end smoke tests for Life Admin live under `e2e/`. Unit tests (`npm test`) stay separate.

## Mock (CI default)

Runs against the in-memory mock backend — no Supabase, no login gate.

```bash
npm ci
npx playwright install chromium
npm run e2e
```

This is what GitHub Actions runs on every PR (`playwright test --project=mock`).

**Covers:** Today dashboard, reminder CRUD, document metadata, V0.3 module navigation + vehicle create, Smart Capture → reminder prefill, calendar export buttons on reminder detail.

## Supabase (optional, test project)

Point Playwright at a **test** Supabase project (or production with a dedicated smoke user). Never commit credentials.

| Variable | Purpose |
|----------|---------|
| `E2E_DATA_SOURCE` | Must be `supabase` |
| `E2E_SUPABASE_URL` | Project API URL |
| `E2E_SUPABASE_ANON_KEY` | Publishable anon key |
| `E2E_USER_EMAIL` | Confirmed test user |
| `E2E_USER_PASSWORD` | Test user password |

```bash
export E2E_DATA_SOURCE=supabase
export E2E_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
export E2E_SUPABASE_ANON_KEY=...
export E2E_USER_EMAIL=...
export E2E_USER_PASSWORD=...

npm run e2e:supabase
```

**Covers:** Login redirect, document file upload + download link (Storage).

Apply all SQL migrations (including `20261110120000_v03_modules.sql`) on the target project before running Supabase E2E.

## Debugging

```bash
npm run e2e:ui
```

Runs Playwright UI mode (mock project unless you set `E2E_DATA_SOURCE=supabase`).
