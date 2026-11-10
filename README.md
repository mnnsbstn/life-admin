# Life Admin

Life Admin is a central dashboard for organizing your private life — household, contracts, documents, reminders, and more.

**Roadmap & status:** [Linear — Life Admin](https://linear.app/mnnsbstn/project/life-admin-f1ba6d229b25) · [Linear sync](docs/LINEAR.md) · [V1 release playbook](docs/RELEASE_V1.md)

**Production:** [life-admin-sand-nu.vercel.app](https://life-admin-sand-nu.vercel.app) · **Read-only demo:** [GitHub Pages](https://mnnsbstn.github.io/life-admin/)

## V1.0 — What works

- **Today:** Greeting, attention cards, upcoming timeline (derived from your data)
- **Home / Contracts / Documents / Reminders:** Lists, detail views, create & edit
- **Quick Add:** ⌘/Ctrl+K or **Add**
- **Data:** Mock by default; optional **Supabase** (auth, all modules, document storage)
- **Household:** Rename, member list, invite links (owner)
- **Delete:** Home, contracts, documents, reminders (from detail view)

## Run locally

```bash
npm install
npm run dev
```

→ [http://localhost:3000/today](http://localhost:3000/today)

For Supabase mode, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_DATA_SOURCE=supabase` plus your project URL and anon key (see [docs/SUPABASE.md](docs/SUPABASE.md)).

**Demo without a domain:** [GitHub Pages](https://mnnsbstn.github.io/life-admin/) (read-only mock)

> **Pages still 404?** One-time: **Settings → Pages → Source: GitHub Actions** — see [docs/GITHUB_PAGES_SETUP.md](docs/GITHUB_PAGES_SETUP.md)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests (dashboard, mappers) |
| `npm run release:smoke` | HTTP checks for production + GitHub Pages |
| `npm run build:gh-pages` | Static export for GitHub Pages |

## Configuration

```env
NEXT_PUBLIC_DATA_SOURCE=mock
```

## Architecture

Full reference: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** (domain-first, repositories, dashboard engine, Supabase/mock).

| Layer | Path |
|-------|------|
| UI / routing | `src/app/(app)/…` |
| Features | `src/features/*` |
| Domain | `src/lib/domain` |
| Services | `src/lib/services` |
| Server Actions | `src/lib/actions` |
| Mock / Supabase | `src/lib/repositories/` |

## Supabase & deployment

- Backend: [docs/SUPABASE.md](docs/SUPABASE.md) (migrations, auth, storage)
- Overview: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Vercel + Supabase (full app):** [docs/VERCEL_SUPABASE.md](docs/VERCEL_SUPABASE.md) · [V1 setup](docs/V1_PRODUCTION_SETUP.md)
- Live URL cheat sheet: [docs/DEINE-LIVE-URL.md](docs/DEINE-LIVE-URL.md)
- Runtime status in the app under **Settings**

## Quality

- Unit tests: `npm test`
- E2E (Playwright, mock backend): `npm run e2e` — see [docs/E2E.md](docs/E2E.md)

## Deliberately not in V1

AI input, banking/calendar/email integrations, real banking hooks. **V0.3** adds Vehicles, Money, and Family modules. Household invite **emails** via Resend: [docs/INVITATION_EMAIL.md](docs/INVITATION_EMAIL.md).
