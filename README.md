# Life Admin

Life Admin is the central dashboard for managing organizational aspects of your private life — home, contracts, documents, and reminders.

## V0.1 status

- **Step 2 complete:** Next.js app, domain model, mock repositories, demo seed data, providers, and route scaffold.
- **Next:** Design system polish (Step 3), full application shell (Step 4), and feature modules.

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Lucide
- Data: in-memory mock repositories (swap-ready for Supabase)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will land on **Today**.

## Project layout

- `src/lib/domain/` — types, Zod schemas, attention/upcoming engines
- `src/lib/repositories/` — repository interfaces and mock implementation
- `src/providers/` — React data context
- `src/app/(app)/` — authenticated-style app routes
