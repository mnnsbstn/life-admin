# Deployment (Life Admin)

Life Admin is a **Next.js 16** App Router project. Production needs a Node-capable host (not plain static hosting unless you pre-render everything without server features — this app uses **Server Actions**, **middleware**, and optional **Supabase**).

## Environment variables

Set these on the host (never commit real values):

| Variable | Production |
|----------|------------|
| `NEXT_PUBLIC_DATA_SOURCE` | `supabase` for live data, or `mock` for demos only |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL from Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon (publishable) key only |

Copy from [`.env.example`](../.env.example). **Do not** put `service_role` keys in `NEXT_PUBLIC_*`.

Build locally to verify:

```bash
npm ci
npm run build
npm run start
```

## Supabase before go-live

1. Run all SQL migrations under `supabase/migrations/` in order (see [SUPABASE.md](./SUPABASE.md)).
2. **Authentication → URL configuration**
   - **Site URL:** `https://your-domain.com`
   - **Redirect URLs:** `https://your-domain.com/auth/callback` (add `http://localhost:3000/auth/callback` for local dev)
3. Enable **Email** provider; tune “Confirm email” for your audience.

## Option A — Vercel (recommended for Next.js)

1. Import the GitHub repo in [Vercel](https://vercel.com/new).
2. Framework preset: **Next.js** (default).
3. Add the three env vars above for **Production** (and Preview if you use Supabase there).
4. Deploy from `main` after merging PRs.

No extra config file is required; `next build` is the build command Vercel detects from `package.json`.

**After deploy:** open `/today`, `/login`, and test sign-up + one CRUD flow.

## Option B — Hostinger Node.js

Hostinger can build and run Node apps from a zip of the repo (see Hostinger “Node.js” / Websites in hPanel).

1. **Confirm DNS** points the domain to Hostinger.
2. Deploy via hPanel or Hostinger API (`hosting_deployJsApplication` / build-from-archive) with:
   - **Build command:** `npm run build`
   - **Start command:** `npm run start` (or Hostinger’s detected Next.js start)
   - **Node version:** 20.x (match `@types/node` in the project)
3. **Environment variables** must be set in **hPanel** for the Node app (not in the uploaded zip). Same three `NEXT_PUBLIC_*` vars as above.
4. Redeploy after changing env vars.

Exclude from upload archives: `node_modules/`, `.next/`, `.git/`, `.env*`.

If the build fails, check Hostinger build logs (install step, `next build`, memory limits).

## Option C — Any Node VPS / Docker

```bash
npm ci
npm run build
PORT=3000 npm run start
```

Put a reverse proxy (nginx, Caddy) in front with TLS. Forward cookies correctly for Supabase auth.

## Mock mode in production

`NEXT_PUBLIC_DATA_SOURCE=mock` works for demos but data is **in-memory per server instance** and resets on restart. Use **Supabase** for real usage.

## Checklist before sharing the URL

- [ ] Migrations applied (including storage + household invitations if using those features)
- [ ] Supabase redirect URLs include production domain
- [ ] Env vars set on host
- [ ] Smoke test: login → create home item → document upload (if Supabase) → settings invite link copies
