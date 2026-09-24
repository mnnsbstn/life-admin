import { compareAsc, parseISO, startOfDay } from "date-fns";

import type { HouseholdDataSnapshot } from "@/lib/domain/types";
import { resolveReminderStatus } from "@/lib/domain/reminders/reminder-status";

export type UpcomingEventKind =
  | "maintenance"
  | "warranty"
  | "contract_cancellation"
  | "contract_end"
  | "reminder";

export interface UpcomingEvent {
  id: string;
  kind: UpcomingEventKind;
  title: string;
  date: string;
  href: string;
}

export function buildUpcomingEvents(
  snapshot: HouseholdDataSnapshot,
  referenceDate: Date = startOfDay(new Date()),
  limit = 12,
): UpcomingEvent[] {
  const events: UpcomingEvent[] = [];
  const ref = startOfDay(referenceDate);

  for (const item of snapshot.homeItems) {
    if (item.nextMaintenanceDate) {
      events.push({
        id: `maintenance:${item.id}`,
        kind: "maintenance",
        title: item.name,
        date: item.nextMaintenanceDate,
        href: `/home/${item.id}`,
      });
    }
    if (item.warrantyEndDate) {
      events.push({
        id: `warranty:${item.id}`,
        kind: "warranty",
        title: `${item.name} warranty`,
        date: item.warrantyEndDate,
        href: `/home/${item.id}`,
      });
    }
  }

  for (const contract of snapshot.contracts) {
    if (contract.nextCancellationDate) {
      events.push({
        id: `cancel:${contract.id}`,
        kind: "contract_cancellation",
        title: contract.name,
        date: contract.nextCancellationDate,
        href: `/contracts/${contract.id}`,
      });
    }
    if (contract.contractEndDate) {
      events.push({
        id: `end:${contract.id}`,
        kind: "contract_end",
        title: contract.name,
        date: contract.contractEndDate,
        href: `/contracts/${contract.id}`,
      });
    }
  }

  for (const reminder of snapshot.reminders) {
    const status = resolveReminderStatus(reminder, ref);
    if (status === "completed") continue;
    events.push({
      id: `reminder:${reminder.id}`,
      kind: "reminder",
      title: reminder.title,
      date: reminder.dueDate,
      href: `/reminders/${reminder.id}`,
    });
  }

  return events
    .filter((e) => parseISO(e.date) >= ref)
    .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)))
    .slice(0, limit);
}
