import type { CalendarEventInput } from "@/lib/calendar/types";
import { refreshGoogleCalendarAccessToken } from "@/lib/integrations/google-calendar/oauth";
import type {
  CalendarProvider,
  UserCalendarConnection,
} from "@/lib/domain/types";
import { addDays, format, parseISO } from "date-fns";

export interface CalendarSyncSourceRef {
  kind: string;
  id: string;
}

export async function upsertGoogleCalendarEvent(
  accessToken: string,
  calendarId: string,
  event: CalendarEventInput,
): Promise<string> {
  const start = parseISO(event.date);
  const endExclusive = format(addDays(start, 1), "yyyy-MM-dd");
  const startKey = format(start, "yyyy-MM-dd");

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: event.title,
        description: event.description,
        start: { date: startKey },
        end: { date: endExclusive },
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Calendar insert failed: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as { id?: string };
  if (!data.id) throw new Error("Google Calendar response missing event id");
  return data.id;
}

export async function ensureGoogleAccessToken(
  connection: UserCalendarConnection,
  updateAccessToken: (
    userId: string,
    provider: CalendarProvider,
    accessToken: string,
    expiresAt: string,
  ) => Promise<void>,
): Promise<string> {
  const now = Date.now();
  const expiresAt = connection.accessTokenExpiresAt
    ? Date.parse(connection.accessTokenExpiresAt)
    : 0;

  if (connection.accessToken && expiresAt > now + 60_000) {
    return connection.accessToken;
  }

  const refreshed = await refreshGoogleCalendarAccessToken(
    connection.refreshToken,
  );
  const expires = new Date(now + refreshed.expires_in * 1000).toISOString();
  await updateAccessToken(
    connection.userId,
    connection.provider,
    refreshed.access_token,
    expires,
  );
  return refreshed.access_token;
}
