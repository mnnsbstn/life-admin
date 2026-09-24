# Life Admin

Central dashboard for managing home items, contracts, documents, and reminders (V0.1 mock data).

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/today`.

## Scripts

- `pnpm dev` — development server
- `pnpm build` — production build
- `pnpm start` — serve production build
- `pnpm lint` — ESLint

## V0.1 notes

- In-memory mock repository (reload resets data)
- No auth, Supabase, or file upload
- Architecture: see project docs in Cursor Agent Store
