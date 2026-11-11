import { addDays, format, parseISO } from "date-fns";

import type { CalendarEventInput } from "@/lib/calendar/types";
import { refreshMicrosoftCalendarAccessToken } from "@/lib/integrations/microsoft-calendar/oauth";
import type {
  CalendarProvider,
  UserCalendarConnection,
} from "@/lib/domain/types";

const EVENT_TIMEZONE = "Europe/Berlin";

export async function upsertMicrosoftCalendarEvent(
  accessToken: string,
  event: CalendarEventInput,
): Promise<string> {
  const start = parseISO(event.date);
  const end = addDays(start, 1);

  const res = await fetch("https://graph.microsoft.com/v1.0/me/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject: event.title,
      body: event.description
        ? { contentType: "text", content: event.description }
        : undefined,
      isAllDay: true,
      start: { dateTime: format(start, "yyyy-MM-dd"), timeZone: EVENT_TIMEZONE },
      end: { dateTime: format(end, "yyyy-MM-dd"), timeZone: EVENT_TIMEZONE },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Microsoft Graph insert failed: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as { id?: string };
  if (!data.id) throw new Error("Microsoft Graph response missing event id");
  return data.id;
}

export async function ensureMicrosoftAccessToken(
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

  const refreshed = await refreshMicrosoftCalendarAccessToken(
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
