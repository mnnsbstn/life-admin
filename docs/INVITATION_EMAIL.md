# Household invitation emails (Resend)

Owners can invite members from **Settings**. Without mail configuration, the app only creates an invitation row and the owner copies the link manually.

With **Resend**, Life Admin sends the invite link automatically on create (and via **E-Mail senden** for open invitations).

## Environment variables (Vercel / server)

| Variable | Required | Example |
|----------|----------|---------|
| `RESEND_API_KEY` | Yes | `re_…` from [Resend](https://resend.com) |
| `INVITATION_EMAIL_FROM` | Yes | `Life Admin <notifications@yourdomain.com>` |
| `LIFE_ADMIN_APP_ORIGIN` | Recommended | `https://life-admin-sand-nu.vercel.app` |

`LIFE_ADMIN_APP_ORIGIN` ensures invite links use your public URL (not an internal Vercel hostname). If omitted, the app uses `VERCEL_URL` or request headers.

## Resend setup

1. Create a Resend account and verify your sending domain (or use `onboarding@resend.dev` for tests only).
2. Add the three variables above in **Vercel → Project → Settings → Environment Variables** (Production + Preview).
3. Redeploy.
4. In the app, **Einstellungen → Daten & Backend** should show **Einladungs-E-Mail: Resend aktiv**.

## Behaviour

- **Supabase mode:** invitation row in `household_invitations`, then Resend API call if configured.
- **Mock mode:** invitations work in memory; email sends only when Resend env vars are set (useful for local experiments).
- If Resend fails, the invitation still exists — use **Link kopieren** or **E-Mail senden**.

## Invite flow for recipients

1. Open `/invite/<token>` from the email.
2. Sign in or register with the **same email** as the invitation.
3. Accept — active household switches to the joined household.

See also [V1 production setup](./V1_PRODUCTION_SETUP.md) and [SUPABASE.md](./SUPABASE.md).
