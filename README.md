# Life Admin

Life Admin ist das zentrale Dashboard für die Organisation des privaten Lebens — Haushalt, Verträge, Dokumente, Erinnerungen und mehr.

## V0.1 — Was funktioniert

- **Heute:** Begrüßung, Attention Cards, Demnächst-Timeline (aus Mock-Daten generiert)
- **Home / Verträge / Dokumente / Erinnerungen:** Listen, Detailansichten, Anlegen & Bearbeiten
- **Quick Add:** ⌘/Ctrl+K oder „Hinzufügen“
- **Daten:** Standard Mock; optional **Supabase Auth + Home + Verträge** (hybrid)

## Lokal starten

```bash
npm install
npm run dev
```

→ [http://localhost:3000/today](http://localhost:3000/today)

## Skripte

| Befehl | Beschreibung |
|--------|----------------|
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Production Build |
| `npm run start` | Production Server |
| `npm run lint` | ESLint |
| `npm run test` | Unit-Tests (Dashboard & Reminder-Status) |

## Konfiguration

```env
NEXT_PUBLIC_DATA_SOURCE=mock
```

## Architektur

| Schicht | Pfad |
|--------|------|
| UI / Routing | `src/app/(app)/…` |
| Features | `src/features/*` |
| Domain | `src/lib/domain` |
| Services | `src/lib/services` |
| Server Actions | `src/lib/actions` |
| Mock Data | `src/lib/repositories/mock` |

## Supabase (V0.2 Prep)

- SQL-Migration: `supabase/migrations/20260924120000_household_core.sql`
- Anleitung: [docs/SUPABASE.md](docs/SUPABASE.md)
- Status in der App unter **Einstellungen**

## Bewusst nicht in V0.1

Auth, live Supabase-Repositories, File Upload, KI-Eingabe, Banking/Kalender/E-Mail, Vehicles/Money/Family
