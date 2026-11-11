# Kalender & E-Mail (SBSTN-65)

V0.3 **light integration** — no OAuth, no inbox sync. Dates from reminders and contracts can be exported; email is draft/share plus Smart Capture for inbox paste.

## Kalender

On **reminder** and **contract** detail pages:

| Action | Behavior |
|--------|----------|
| **Google Kalender** | Opens Google Calendar with a pre-filled all-day event |
| **.ics** | Downloads a file for Apple Calendar, Outlook, etc. (client-side; works on GitHub Pages) |

Contract exports use **Kündigung ab** (`resolveNextCancellationDate`) and **Vertragsende** when set.

Implementation: `src/lib/calendar/` (`google-calendar-url.ts`, `ics.ts`, `event-builders.ts`).

**Haushalts-Export:** Einstellungen → **Kalender & Integrationen** → `Kalenderdatei (.ics)` — alle offenen Erinnerungen plus Vertrags-Kündigung/Ende (`household-feed.ts`).

**Abo-Feed (webcal/HTTPS):** Mit `CALENDAR_FEED_SIGNING_SECRET` erzeugt die App einen persönlichen Link `GET /api/calendar/{householdId}/{token}` (ICS, 5 min Cache). Bei **Supabase** zusätzlich `SUPABASE_SERVICE_ROLE_KEY` nur auf dem Server (RLS-Bypass für token-geschützte Route). Nicht auf GitHub Pages (kein API-Export).

## E-Mail

| Flow | Behavior |
|------|----------|
| **E-Mail** button | Opens `mailto:` with subject/body (share with household or self) |
| **Smart Capture** | Paste forwarded invoice/mail text at `/capture` (SBSTN-64) |

Outbound transactional mail remains **Resend invites only** (`docs/INVITATION_EMAIL.md`).

## Google OAuth (V0.4)

See [GOOGLE_CALENDAR_OAUTH.md](./GOOGLE_CALENDAR_OAUTH.md) — connect in settings, manual sync to Google Calendar.

## Later (backlog)

- Microsoft OAuth
- Two-way calendar sync + event updates
- Dedicated inbox forwarding address + parsing webhooks
