# Release — Smoke-Test

**Production:** [https://life-admin-sand-nu.vercel.app](https://life-admin-sand-nu.vercel.app)  
**Demo (Mock):** [https://mnnsbstn.github.io/life-admin/](https://mnnsbstn.github.io/life-admin/)

Linear: [SBSTN-99](https://linear.app/mnnsbstn/issue/SBSTN-99/release-production-smoke-test)

---

## Automatisch (CI / lokal)

```bash
npm run release:smoke
```

Prüft u. a. Login-Seite (200), Auth-Gate `/today` (307), `/api/health/supabase` (`ok: true`), GitHub Pages erreichbar.

---

## Manuell (V1 Sign-off)

| # | Check | Erwartung |
|---|--------|-----------|
| 1 | **Login / Registrieren** | Nach Sign-up → `/today`, **kein** 500 |
| 2 | **Home-Item** anlegen + Reload | Eintrag bleibt |
| 3 | **Dokument** Upload + Download | Storage-Bucket ok |
| 4 | **Einstellungen** | Laufzeit „Supabase (alle Module + Storage)“ |
| 5 | **Einladung** (optional) | Link kopieren unter Settings |

Voraussetzung Auth: [SBSTN-101](https://linear.app/mnnsbstn/issue/SBSTN-101/release-supabase-auth-urls-and-e-mail-einstellungen) — URLs + **E-Mail-Bestätigung** (siehe unten).

---

## Stand 4. Nov. 2026 (Agent)

| Bereich | Ergebnis |
|---------|----------|
| PR #28 Login/Session-Fix | **Merged** (1. Nov. 2026) |
| Vercel Env / Supabase API | **OK** — Health: `ok:true`, Host `oxnyvzsvrvnncorsgyjo.supabase.co` |
| Auth-Gate | **OK** — `/today` → `/login?next=…` |
| GitHub Pages Deploy | **OK** — Workflow grün; `/today/` Mock read-only (200) |
| GitHub Pages (SBSTN-102) | **Verifiziert** — siehe `npm run release:smoke` |
| Registrierung neuer User | **Blockiert** — Login-Fehler *Email not confirmed*; Bestätigungsmail kam für Test-Adresse nicht an |

**Blocker für vollständigen Smoke-Test:** In Supabase **Authentication → Providers → Email** für V1 entweder **Confirm email deaktivieren** (empfohlen für schnellen Go-live) **oder** SMTP/Custom SMTP konfigurieren. Danach Registrierung erneut testen.

Screenshot: siehe Agent-Artefakt `release-smoke-login.png` (Cloud Run Nov. 2026).

---

## Nach Freigabe

- [SBSTN-99](https://linear.app/mnnsbstn/issue/SBSTN-99) → **Done**
- Parent [SBSTN-97](https://linear.app/mnnsbstn/issue/SBSTN-97) (V1 Sign-off) prüfen
