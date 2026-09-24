# Life Admin

Life Admin ist das zentrale Dashboard für die Organisation des privaten Lebens — Haushalt, Verträge, Dokumente, Erinnerungen und mehr.

## V0.2 — Was funktioniert

- **Heute:** Begrüßung, Attention Cards, Demnächst-Timeline (aus Mock-Daten generiert)
- **Home / Verträge / Dokumente / Erinnerungen:** Listen, Detailansichten, Anlegen & Bearbeiten
- **Quick Add:** ⌘/Ctrl+K oder „Hinzufügen“
- **Daten:** Standard Mock; optional **Supabase** (Auth, alle Module, Dokument-Storage)
- **Haushalt:** Name ändern, Mitgliederliste, Einladungslinks (Owner)
- **Löschen:** Home, Verträge, Dokumente, Erinnerungen (Detailansicht)

## Lokal starten

```bash
npm install
npm run dev
```

→ [http://localhost:3000/today](http://localhost:3000/today)

**Demo ohne Domain:** [GitHub Pages](https://mnnsbstn.github.io/life-admin/) (read-only Mock)

> **Pages noch 404?** Einmalig **Settings → Pages → Source: GitHub Actions** — Anleitung: [docs/GITHUB_PAGES_SETUP.md](docs/GITHUB_PAGES_SETUP.md)

## Skripte

| Befehl | Beschreibung |
|--------|----------------|
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Production Build |
| `npm run start` | Production Server |
| `npm run lint` | ESLint |
| `npm run test` | Unit-Tests (Dashboard, Mapper) |
| `npm run build:gh-pages` | Statischer Export für GitHub Pages |

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

## Supabase & Deployment

- Backend: [docs/SUPABASE.md](docs/SUPABASE.md) (Migrationen, Auth, Storage)
- Go-live: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) (Übersicht)
- **Vercel + Supabase (volle App):** [docs/VERCEL_SUPABASE.md](docs/VERCEL_SUPABASE.md)
- Status in der App unter **Einstellungen**

## Bewusst noch nicht drin

KI-Eingabe, Banking/Kalender/E-Mail, Vehicles/Money/Family, E-Mail-Versand für Einladungen (nur Link kopieren)
