# Microsoft Calendar OAuth (SBSTN-117)

Same push-only model as Google: connect in settings, **Jetzt synchronisieren** creates missing all-day events in the default Outlook calendar via Microsoft Graph.

## Azure app registration

1. [Microsoft Entra ID](https://portal.azure.com/) → App registrations → New registration.
2. Redirect URI (Web): `https://YOUR_DOMAIN/api/integrations/microsoft/calendar/callback` (and local dev URL).
3. Certificates & secrets → client secret.
4. API permissions: **Microsoft Graph** delegated `Calendars.ReadWrite`, `openid`, `email`, `offline_access`.

## Env

| Variable | Purpose |
|----------|---------|
| `MICROSOFT_CALENDAR_CLIENT_ID` | Application (client) ID |
| `MICROSOFT_CALENDAR_CLIENT_SECRET` | Client secret |
| `MICROSOFT_CALENDAR_TENANT_ID` | Optional; default `common` |

Also requires OAuth state signing (`GOOGLE_OAUTH_STATE_SECRET` or `CALENDAR_FEED_SIGNING_SECRET`) — shared with Google connect flow.

## Supabase

Run migrations through `20261111140000_calendar_provider_microsoft.sql` (`calendar_provider` enum value `microsoft`).
