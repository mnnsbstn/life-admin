import { addDays, format, parseISO } from "date-fns";

import type { CalendarEventInput } from "@/lib/calendar/types";

/** All-day Google Calendar "TEMPLATE" link (end date is exclusive). */
export function buildGoogleCalendarUrl(event: CalendarEventInput): string {
  const start = parseISO(event.date);
  const endExclusive = format(addDays(start, 1), "yyyyMMdd");
  const startKey = format(start, "yyyyMMdd");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${startKey}/${endExclusive}`,
  });

  if (event.description?.trim()) {
    params.set("details", event.description.trim());
  }
  if (event.location?.trim()) {
    params.set("location", event.location.trim());
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
