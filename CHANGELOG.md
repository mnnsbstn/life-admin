# Changelog

All notable changes to **Life Admin** are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-11-10

### Added

- Core modules: Today, Home, Contracts, Documents, Reminders (CRUD, detail views, Quick Add)
- Supabase backend: Auth, RLS, household tenancy, invitations, document storage
- Mock mode and GitHub Pages read-only demo
- Household settings: name, members, invite links
- Architecture reference: `docs/ARCHITECTURE.md`
- Release tooling: `npm run release:smoke`, CI production smoke on `main`

### Fixed

- Login/session 500 after auth (`ensure_my_household`)
- Supabase URL/key diagnostics and env trimming
- Sign-up flow when email confirmation is required (info message, no false redirect)
- GitHub Pages static export (health API stripping)

### Docs

- Vercel + Supabase setup, deployment modes, Linear sync, release smoke checklist

## [0.2.0] - (pre-1.0 history on `main`)

Early V0.2 milestones: Supabase repositories, proxy auth, Vercel production URL, demo seed on sign-up.

[1.0.0]: https://github.com/mnnsbstn/life-admin/compare/v0.2.0...v1.0.0
