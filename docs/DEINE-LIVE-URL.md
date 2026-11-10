# Life Admin — nur diese URL merken

## App (Production)

**https://life-admin-sand-nu.vercel.app**

- Today: https://life-admin-sand-nu.vercel.app/today  
- Login: https://life-admin-sand-nu.vercel.app/login  

**Nicht** die lange Deployment-URL (`life-admin-1jgt6ua7x-…`) — die ist oft SSO-geschützt.

## Supabase (Backend)

- Dashboard: https://supabase.com/dashboard/project/oxnyvzsvrvnncorsgyjo  
- API URL (Vercel Env): `https://oxnyvzsvrvnncorsgyjo.supabase.co`  

## Supabase Auth — exakt eintragen

**Authentication → Providers → Email**

- Dashboard: [Email provider](https://supabase.com/dashboard/project/oxnyvzsvrvnncorsgyjo/auth/providers?provider=Email)
- Für V1 ohne SMTP: **Confirm email** ausschalten (sonst Registrierung ohne Login).
- Nach mehreren Test-Registrierungen: ggf. **Rate-Limit** — kurz warten oder User manuell anlegen ([Auth Users](https://supabase.com/dashboard/project/oxnyvzsvrvnncorsgyjo/auth/users)).
- Optional später: Custom SMTP unter Project Settings → Auth.

**Authentication → URL configuration**

- Dashboard: [URL configuration](https://supabase.com/dashboard/project/oxnyvzsvrvnncorsgyjo/auth/url-configuration)

| Feld | Wert |
|------|------|
| Site URL | `https://life-admin-sand-nu.vercel.app` |
| Redirect URLs | `https://life-admin-sand-nu.vercel.app/auth/callback` |
| Redirect URLs | `http://localhost:3000/auth/callback` |

## Vercel Env (Production)

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_DATA_SOURCE` | `supabase` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://oxnyvzsvrvnncorsgyjo.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Supabase → Settings → API → anon/publishable)* |

Danach: **Deployments → Redeploy**.
