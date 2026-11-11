# Google Calendar OAuth (SBSTN-114)

One-way sync: after connecting Google, **Jetzt synchronisieren** pushes open reminders and contract milestones into the user’s **primary** Google calendar. Each item is synced at most once per user (tracked in `calendar_synced_events`).

## Google Cloud setup

1. Create an OAuth 2.0 **Web client** in [Google Cloud Console](https://console.cloud.google.com/).
2. Authorized redirect URI: `https://YOUR_DOMAIN/api/integrations/google/calendar/callback` (and `http://127.0.0.1:3000/...` for local dev).
3. Enable **Google Calendar API**.

## Vercel / server env

| Variable | Purpose |
|----------|---------|
| `GOOGLE_CALENDAR_CLIENT_ID` | OAuth client ID |
| `GOOGLE_CALENDAR_CLIENT_SECRET` | OAuth client secret |
| `GOOGLE_OAUTH_STATE_SECRET` | HMAC for OAuth `state` (optional if `CALENDAR_FEED_SIGNING_SECRET` is set) |

## Supabase

Apply migration `20261111130000_calendar_integrations.sql` (`user_calendar_connections`, `calendar_synced_events`).

## Flow

1. Settings → **Google Kalender verbinden** → Google consent → callback stores refresh token (RLS: own row only).
2. **Jetzt synchronisieren** — inserts missing events; skips already synced sources.

## Limits (V0.4)

- Google only (Microsoft backlog).
- Push only (no import from Google).
- Updates/deletes in Life Admin do not update Google events yet.
