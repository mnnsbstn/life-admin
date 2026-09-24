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

5. **Hybrid-Modus:** User, Household, **Home Items**, **Verträge**, **Erinnerungen** → Supabase; **Dokumente** → weiter Mock.

## Nächste Schritte

1. Supabase-Repository für Documents (+ Storage)
2. Storage Bucket für Dokumente
3. Optional: Demo-Seed SQL für neue Haushalte

## Mock vs. Supabase

V0.1 nutzt **Mock (In-Memory)**. Der Status steht unter **Einstellungen** in der App.
