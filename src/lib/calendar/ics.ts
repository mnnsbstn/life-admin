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

function buildVeventLines(
  event: CalendarEventInput,
  uid: string,
  stamp: string,
): string[] {
  const start = parseISO(event.date);
  const endExclusive = format(addDays(start, 1), "yyyyMMdd");
  const startKey = format(start, "yyyyMMdd");

  const lines = [
    "BEGIN:VEVENT",
    `UID:${uid}`,
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

  lines.push("END:VEVENT");
  return lines;
}

function defaultEventUid(event: CalendarEventInput): string {
  const startKey = format(parseISO(event.date), "yyyyMMdd");
  return `la-${startKey}-${event.title.replace(/\s+/g, "-").slice(0, 40)}@life-admin`;
}

/** Multi-event calendar file (import/subscribe in Outlook, Apple, etc.). */
export function buildIcsFeed(
  events: CalendarEventInput[],
  calendarName = "Life Admin",
): string {
  const stamp = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Life Admin//DE",
    "CALSCALE:GREGORIAN",
    foldIcsLine(`X-WR-CALNAME:${escapeIcsText(calendarName)}`),
  ];

  for (const event of events) {
    lines.push(
      ...buildVeventLines(event, defaultEventUid(event), stamp),
    );
  }

  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}

/** Minimal iCalendar file for a single all-day event. */
export function buildIcsCalendarFile(
  event: CalendarEventInput,
  uid?: string,
): string {
  const stamp = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");
  const eventUid = uid ?? defaultEventUid(event);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Life Admin//DE",
    "CALSCALE:GREGORIAN",
    ...buildVeventLines(event, eventUid, stamp),
    "END:VCALENDAR",
  ];
  return `${lines.join("\r\n")}\r\n`;
}
