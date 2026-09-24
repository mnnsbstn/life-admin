# Life Admin

Life Admin ist das zentrale Dashboard für die Organisation des privaten Lebens — Haushalt, Verträge, Dokumente, Erinnerungen und mehr.

## V0.1 — Was funktioniert

- **Heute:** Begrüßung, Attention Cards, Demnächst-Timeline (aus Mock-Daten generiert)
- **Home / Verträge / Dokumente / Erinnerungen:** Listen, Detailansichten, Anlegen & Bearbeiten
- **Quick Add:** ⌘/Ctrl+K oder „Hinzufügen“
- **Daten:** In-Memory Mock-Repositories (Session), vorbereitet für Supabase

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

## Bewusst nicht in V0.1

Auth, File Upload, KI-Eingabe, Banking/Kalender/E-Mail, Vehicles/Money/Family
