# Vercel + Supabase (volle Life Admin App)

Ziel: **Login, CRUD, Storage, Haushalt** auf einer kostenlosen **`*.vercel.app`**-URL — ohne eigene Domain.

Geschätzter Aufwand: Supabase-Projekt anlegen, vier SQL-Dateien ausführen, Repo in Vercel importieren, drei Env-Vars setzen, Auth-URLs eintragen.

---

## Teil 1 — Supabase-Projekt

1. [supabase.com/dashboard](https://supabase.com/dashboard) → **New project** (Region nah an dir, DB-Passwort sicher speichern).
2. Warten, bis das Projekt **Active** ist.
3. **Project Settings → API** notieren:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / publishable key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   (Nicht `service_role` / Secret Key verwenden.)

### Migrationen (Reihenfolge!)

**SQL Editor → New query** — jede Datei **einmal**, in dieser Reihenfolge ausführen:

| # | Datei im Repo |
|---|----------------|
| 1 | `supabase/migrations/20260924120000_household_core.sql` |
| 2 | `supabase/migrations/20260924120100_on_auth_user_created.sql` |
| 3 | `supabase/migrations/20260924120200_documents_storage.sql` |
| 4 | `supabase/migrations/20260924120300_household_management.sql` |

Bei Fehlern: Meldung lesen (oft „already exists“ = ok, wenn du erneut klickst).

### Auth (Supabase Dashboard)

**Authentication → Providers → Email:** aktivieren.

Für schnelles Testen: **Authentication → Sign In / Providers → Email** → „Confirm email“ oft **aus**, damit Sign-up sofort eine Session hat.

**Authentication → URL configuration** — erst **nach** dem ersten Vercel-Deploy (wenn du die URL kennst), siehe Teil 3.

---

## Teil 2 — Vercel

1. [vercel.com/new](https://vercel.com/new) → GitHub → Repo **`mnnsbstn/life-admin`** importieren.
2. **Framework:** Next.js (auto). Root: Repository-Root. `vercel.json` ist optional vorkonfiguriert.
3. **Environment Variables** (mindestens **Production**):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_DATA_SOURCE` | `supabase` |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(dein anon key)* |

   Optional dieselben drei Variablen für **Preview**, wenn du PR-Previews mit Supabase testen willst.

4. **Deploy** abwarten → URL notieren, z. B. `https://life-admin-xxxx.vercel.app`.

---

## Teil 3 — Supabase ↔ Vercel verknüpfen

Ersetze `https://DEINE-VERCEL-URL.vercel.app` durch deine echte Production-URL.

**Authentication → URL configuration:**

| Feld | Wert |
|------|------|
| **Site URL** | `https://DEINE-VERCEL-URL.vercel.app` |
| **Redirect URLs** | `https://DEINE-VERCEL-URL.vercel.app/auth/callback` |
| | `http://localhost:3000/auth/callback` *(lokal)* |

Speichern. Kein Redeploy nötig, wenn Env-Vars schon gesetzt waren.

---

## Teil 4 — Smoke-Test

1. `https://DEINE-VERCEL-URL.vercel.app/today` — sollte auf **Login** leiten (Supabase-Modus).
2. **Registrieren** → landest auf `/today`.
3. **Home Item** anlegen → Detail öffnen.
4. **Dokument** mit PDF → **Download** testen.
5. **Einstellungen** → Haushaltsname / Mitglieder sichtbar.

**Einstellungen** in der App sollten **Laufzeit: Supabase (alle Module + Storage)** zeigen.

---

## Troubleshooting

| Symptom | Check |
|---------|--------|
| Immer Mock / kein Login | Vercel Env: `NEXT_PUBLIC_DATA_SOURCE=supabase`, Redeploy nach Env-Änderung |
| Login loop / kein Callback | Redirect URL exakt `/auth/callback`, HTTPS, keine trailing slash |
| „Kein Haushalt“ nach Sign-up | Migration `20260924120100_on_auth_user_created.sql` ausgeführt? |
| Upload/Download fehlgeschlagen | Migration `20260924120200_documents_storage.sql`, Bucket `life-admin-documents` |
| RLS / permission errors | Alle vier Migrationen? Eingeloggt als der User, der die Daten anlegt? |

---

## GitHub Pages vs. Vercel

| | GitHub Pages | Vercel + Supabase |
|--|----------------|-------------------|
| URL | `mnnsbstn.github.io/life-admin` | `*.vercel.app` |
| Modus | Read-only Mock | Volle App |

Beides kann parallel laufen.
