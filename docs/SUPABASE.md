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
NEXT_PUBLIC_DATA_SOURCE=mock   # oder supabase (Repository-Switch folgt)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

**Niemals** `service_role` oder Secret Keys in `NEXT_PUBLIC_*` oder Client-Code legen.

## Nächste Implementierungsschritte

1. Supabase Auth (Login) + Session in Next.js (`@supabase/ssr`)
2. Repository-Implementierungen unter `src/lib/repositories/supabase/`
3. `getRepositories()` → Mock oder Supabase je nach Env + Session
4. Storage Bucket für Dokumente (`documents` Pfad pro Household)
5. Demo-Seed als SQL oder Dashboard-Script

## Mock vs. Supabase

V0.1 nutzt **Mock (In-Memory)**. Der Status steht unter **Einstellungen** in der App.
