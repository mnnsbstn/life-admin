# Supabase (V0.2 Vorbereitung)

Life Admin ist für **household-scoped** Daten mit **Supabase Auth + RLS** vorbereitet.

## Migration

SQL liegt unter:

`supabase/migrations/20260924120000_household_core.sql`

Enthält Tabellen für:

- `profiles`, `households`, `household_members`
- `home_items`, `contracts`, `documents`, `reminders`

Alle fachlichen Tabellen haben `household_id` und RLS-Policies über `household_members.user_id = auth.uid()`.

## Lokales Supabase (optional)

```bash
# Supabase CLI installieren, dann im Repo:
supabase init   # falls noch nicht vorhanden
supabase db reset
```

Alternativ: SQL im Supabase Dashboard → SQL Editor ausführen.

## Umgebungsvariablen

```env
NEXT_PUBLIC_DATA_SOURCE=mock   # oder supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

**Niemals** `service_role` oder Secret Keys in `NEXT_PUBLIC_*` oder Client-Code legen.

## Auth (V0.2)

1. Migrationen anwenden (inkl. `20260924120100_on_auth_user_created.sql`)
2. `.env.local`:

```env
NEXT_PUBLIC_DATA_SOURCE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

3. Im Supabase Dashboard → **Authentication → Providers**: E-Mail aktivieren.  
   Für lokale Entwicklung oft **Confirm email** deaktivieren, damit Sign-up sofort eine Session erzeugt.

4. App: `/login` — Registrierung legt Profil + Haushalt per Trigger an.

5. **Supabase-Modus:** User, Household, **Home Items**, **Verträge**, **Erinnerungen** und **Dokumente** (Metadaten in Postgres, Dateien in Storage).

## Dokumente & Storage

Zusätzliche Migration:

`supabase/migrations/20260924120200_documents_storage.sql`

- Bucket `life-admin-documents` (privat, max. 50 MB pro Datei)
- Pfad: `{household_id}/{document_id}/{filename}`
- RLS: nur Mitglieder des Haushalts (Ordner = erste Pfadkomponente)

Downloads laufen über `/documents/[id]/download` (signierte URL, 10 Minuten gültig).

## Haushalt & Einladungen

Migration `supabase/migrations/20260924120300_household_management.sql`:

- Haushaltsnamen ändern (Owner)
- Tabelle `household_invitations` + Einladungslinks `/invite/[token]`
- RPC `accept_household_invitation` zum Beitreten

## Deployment (Kurz)

1. Hosting (z. B. Vercel) mit Env: `NEXT_PUBLIC_DATA_SOURCE=supabase`, URL, Anon Key  
2. Supabase → **Authentication → URL configuration**: Site URL und Redirect URLs auf deine Domain (inkl. `/auth/callback`)  
3. Alle Migrationen in Reihenfolge ausführen  

## Nächste Schritte

1. Optional: Demo-Seed SQL für neue Haushalte  
2. Optional: Middleware → Proxy (Next.js Hinweis)  
3. E2E-Tests gegen ein Test-Projekt  

## Mock vs. Supabase

V0.1 nutzt **Mock (In-Memory)**. Der Status steht unter **Einstellungen** in der App.
