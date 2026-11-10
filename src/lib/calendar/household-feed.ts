import {
  contractCalendarExports,
  reminderCalendarEvent,
} from "@/lib/calendar/event-builders";
import type { CalendarEventInput } from "@/lib/calendar/types";
import type { Contract, Reminder } from "@/lib/domain/types";
import { withDerivedReminderStatus } from "@/lib/domain/reminder-status";

/** Reminders + contract milestones for a household ICS export. */
export function buildHouseholdCalendarEvents(
  reminders: Reminder[],
  contracts: Contract[],
): CalendarEventInput[] {
  const events: CalendarEventInput[] = [];

  for (const reminder of reminders) {
    const status = withDerivedReminderStatus(reminder).status;
    if (status === "completed") continue;
    events.push(reminderCalendarEvent(reminder));
  }

  for (const contract of contracts) {
    for (const item of contractCalendarExports(contract)) {
      events.push(item.event);
    }
  }

  events.sort((a, b) => a.date.localeCompare(b.date));
  return events;
}
