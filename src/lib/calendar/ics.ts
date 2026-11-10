import { addDays, format, parseISO } from "date-fns";

import type { CalendarEventInput } from "@/lib/calendar/types";

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldIcsLine(line: string): string {
  const max = 70;
  if (line.length <= max) return line;
  const parts: string[] = [];
  let rest = line;
  while (rest.length > max) {
    parts.push(rest.slice(0, max));
    rest = ` ${rest.slice(max)}`;
  }
  parts.push(rest);
  return parts.join("\r\n");
}

/** Minimal iCalendar file for a single all-day event. */
export function buildIcsCalendarFile(
  event: CalendarEventInput,
  uid?: string,
): string {
  const start = parseISO(event.date);
  const endExclusive = format(addDays(start, 1), "yyyyMMdd");
  const startKey = format(start, "yyyyMMdd");
  const stamp = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");
  const eventUid =
    uid ??
    `la-${startKey}-${event.title.replace(/\s+/g, "-").slice(0, 40)}@life-admin`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Life Admin//DE",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${eventUid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${startKey}`,
    `DTEND;VALUE=DATE:${endExclusive}`,
    foldIcsLine(`SUMMARY:${escapeIcsText(event.title)}`),
  ];

  if (event.description?.trim()) {
    lines.push(foldIcsLine(`DESCRIPTION:${escapeIcsText(event.description)}`));
  }
  if (event.location?.trim()) {
    lines.push(foldIcsLine(`LOCATION:${escapeIcsText(event.location)}`));
  }

  lines.push("END:VEVENT", "END:VCALENDAR");

  return `${lines.join("\r\n")}\r\n`;
}
