import type { Contract } from "@/lib/domain/types/contract";
import type { HomeItem } from "@/lib/domain/types/home-item";
import type { Reminder } from "@/lib/domain/types/reminder";
import { MAX_UPCOMING_ITEMS } from "@/config/attention-rules";
import { cancellationDateIso, renewalDate } from "./dates";
import { formatDateShortDE } from "@/lib/utils/format";
import { resolveReminderStatus } from "./reminder-status";

export type UpcomingEvent = {
  id: string;
  date: string;
  label: string;
  href: string;
};

type Snapshot = {
  homeItems: HomeItem[];
  contracts: Contract[];
  reminders: Reminder[];
};

export function generateUpcomingEvents(snapshot: Snapshot): UpcomingEvent[] {
  const events: UpcomingEvent[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const item of snapshot.homeItems) {
    if (item.nextMaintenanceAt) {
      events.push({
        id: `up-maint-${item.id}`,
        date: item.nextMaintenanceAt,
        label: `${item.name} · Maintenance`,
        href: `/home/${item.id}`,
      });
    }
    if (item.warrantyEndsAt) {
      events.push({
        id: `up-war-${item.id}`,
        date: item.warrantyEndsAt,
        label: `${item.name} · Warranty ends`,
        href: `/home/${item.id}`,
      });
    }
  }

  for (const contract of snapshot.contracts) {
    const cancel = cancellationDateIso(contract);
    if (cancel) {
      events.push({
        id: `up-cancel-${contract.id}`,
        date: cancel,
        label: `${contract.name} · Cancel by`,
        href: `/contracts/${contract.id}`,
      });
    }
    const renew = renewalDate(contract);
    if (renew) {
      const iso = renew.toISOString().slice(0, 10);
      events.push({
        id: `up-renew-${contract.id}`,
        date: iso,
        label: `${contract.name} · Renewal`,
        href: `/contracts/${contract.id}`,
      });
    }
  }

  for (const reminder of snapshot.reminders) {
    if (resolveReminderStatus(reminder) === "completed") continue;
    events.push({
      id: `up-rem-${reminder.id}`,
      date: reminder.dueDate,
      label: reminder.title,
      href: `/reminders/${reminder.id}`,
    });
  }

  events.sort(
    (a, b) => new Date(`${a.date}T12:00:00`).getTime() - new Date(`${b.date}T12:00:00`).getTime(),
  );

  return events
    .filter((e) => new Date(`${e.date}T12:00:00`).getTime() >= today.getTime())
    .slice(0, MAX_UPCOMING_ITEMS);
}

export function formatUpcomingLine(event: UpcomingEvent): string {
  return `${formatDateShortDE(event.date)} – ${event.label}`;
}
