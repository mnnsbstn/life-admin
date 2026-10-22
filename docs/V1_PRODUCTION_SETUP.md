# V1 Production — SBSTN-55

Stand: Supabase-Projekt **life-admin** (Region **eu-central-1**) ist angelegt; alle **5 Migrationen** sind angewendet (Schema, Auth-Trigger, Storage, Einladungen, Demo-Seed).

**Supabase Dashboard:** [Project `oxnyvzsvrvnncorsgyjo`](https://supabase.com/dashboard/project/oxnyvzsvrvnncorsgyjo)

| Variable | Wert (Quelle) |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project Settings → API → Project URL** (`https://oxnyvzsvrvnncorsgyjo.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Project Settings → API → anon** oder **publishable** key — **nie** `service_role` |

Keys **nicht** ins Git committen; nur in Vercel (und lokal `.env.local`) setzen.

---

## Deine Schritte (Vercel)

1. **[vercel.com/new](https://vercel.com/new)** → GitHub → **`mnnsbstn/life-admin`** importieren.
2. **Environment Variables** (Production):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_DATA_SOURCE` | `supabase` |
   | `NEXT_PUBLIC_SUPABASE_URL` | *(aus Supabase API Settings)* |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(anon/publishable key)* |

3. **Deploy** → Production-URL notieren, z. B. `https://life-admin-xxxx.vercel.app`.

---

## Supabase Auth (nach erstem Deploy)

**Authentication → URL configuration** (Projekt life-admin):

| Feld | Wert |
|------|------|
| **Site URL** | `https://DEINE-VERCEL-URL.vercel.app` |
| **Redirect URLs** | `https://DEINE-VERCEL-URL.vercel.app/auth/callback` |
| | `http://localhost:3000/auth/callback` |

**Authentication → Providers → Email:** aktiv. Für schnellen Test oft **Confirm email** deaktivieren.

---

## Smoke-Test (V1 fertig)

1. `/today` → Redirect **Login**
2. **Registrieren** → `/today` mit **Beispieldaten** (Demo-Seed)
3. Home Item anlegen, Dokument hochladen + Download
4. **Einstellungen** → „Supabase (alle Module + Storage)“

Wenn alles grün: [SBSTN-55](https://linear.app/mnnsbstn/issue/SBSTN-55) in Linear auf **Done**.

Ausführliche Referenz: [VERCEL_SUPABASE.md](./VERCEL_SUPABASE.md)
