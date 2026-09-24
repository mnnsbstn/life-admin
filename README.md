# Life Admin

Life Admin ist das zentrale Dashboard für die Organisation des privaten Lebens — Haushalt, Verträge, Dokumente, Erinnerungen und mehr.

## V0.1 Status

- **Step 2 (Project Setup):** Next.js, TypeScript, Tailwind, shadcn/ui, Domain-Modell, Mock-Repositories, Demo-Daten, Routing-Grundgerüst
- **Als Nächstes:** Design System, Application Shell, Today Dashboard (Steps 3–5)

## Lokal starten

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) — Redirect nach `/today`.

## Skripte

| Befehl | Beschreibung |
|--------|----------------|
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Production Build |
| `npm run start` | Production Server |
| `npm run lint` | ESLint |

## Konfiguration

Kopiere `.env.example` nach `.env.local` (optional). Standard:

```env
NEXT_PUBLIC_DATA_SOURCE=mock
```

## Architektur (Kurz)

- **Domain:** `src/lib/domain`
- **Datenzugriff:** `src/lib/repositories` (Mock; Supabase-Stub unter `src/lib/supabase`)
- **Dashboard-Logik:** `src/lib/services/dashboard.service.ts`
- **UI:** App Router unter `src/app/(app)/…`
