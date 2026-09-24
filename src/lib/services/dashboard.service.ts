import {
  differenceInCalendarDays,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";

import {
  ATTENTION_WINDOW_DAYS,
  UPCOMING_MAX_ITEMS,
  UPCOMING_WINDOW_DAYS,
} from "@/lib/constants";
import { withDerivedReminderStatus } from "@/lib/domain/reminder-status";
import type {
  AttentionItem,
  Contract,
  HomeItem,
  Reminder,
  UpcomingItem,
} from "@/lib/domain/types";

export interface DashboardInput {
  homeItems: HomeItem[];
  contracts: Contract[];
  reminders: Reminder[];
  referenceDate?: Date;
}

function daysUntil(dateIso: string, referenceDate: Date): number {
  const target = startOfDay(parseISO(dateIso));
  const today = startOfDay(referenceDate);
  return differenceInCalendarDays(target, today);
}

function withinAttentionWindow(dateIso: string, referenceDate: Date): boolean {
  const days = daysUntil(dateIso, referenceDate);
  return days <= ATTENTION_WINDOW_DAYS && days >= -14;
}

function withinUpcomingWindow(dateIso: string, referenceDate: Date): boolean {
  const days = daysUntil(dateIso, referenceDate);
  return days >= 0 && days <= UPCOMING_WINDOW_DAYS;
}

export function buildAttentionItems(input: DashboardInput): AttentionItem[] {
  const referenceDate = input.referenceDate ?? new Date();
  const items: AttentionItem[] = [];

  for (const homeItem of input.homeItems) {
    if (
      homeItem.warrantyEndsAt &&
      withinAttentionWindow(homeItem.warrantyEndsAt, referenceDate)
    ) {
      const urgencyDays = daysUntil(homeItem.warrantyEndsAt, referenceDate);
      items.push({
        id: `warranty:${homeItem.id}`,
        kind: "warranty",
        title: `Garantie endet: ${homeItem.name}`,
        subtitle: homeItem.manufacturer,
        dueDate: homeItem.warrantyEndsAt,
        urgencyDays,
        href: `/home/${homeItem.id}`,
        entityType: "home_item",
        entityId: homeItem.id,
      });
    }

    if (
      homeItem.nextMaintenanceAt &&
      withinAttentionWindow(homeItem.nextMaintenanceAt, referenceDate)
    ) {
      const urgencyDays = daysUntil(homeItem.nextMaintenanceAt, referenceDate);
      items.push({
        id: `maintenance:${homeItem.id}`,
        kind: "maintenance",
        title: `Wartung steht an: ${homeItem.name}`,
        subtitle: homeItem.location,
        dueDate: homeItem.nextMaintenanceAt,
        urgencyDays,
        href: `/home/${homeItem.id}`,
        entityType: "home_item",
        entityId: homeItem.id,
      });
    }
  }

  for (const contract of input.contracts) {
    if (
      contract.nextCancellationDate &&
      withinAttentionWindow(contract.nextCancellationDate, referenceDate)
    ) {
      const urgencyDays = daysUntil(
        contract.nextCancellationDate,
        referenceDate,
      );
      items.push({
        id: `cancellation:${contract.id}`,
        kind: "cancellation",
        title: `Kündigungsfenster: ${contract.name}`,
        subtitle: contract.provider,
        dueDate: contract.nextCancellationDate,
        urgencyDays,
        href: `/contracts/${contract.id}`,
        entityType: "contract",
        entityId: contract.id,
      });
    }

    if (
      contract.contractEndDate &&
      withinAttentionWindow(contract.contractEndDate, referenceDate)
    ) {
      const urgencyDays = daysUntil(contract.contractEndDate, referenceDate);
      items.push({
        id: `contract_end:${contract.id}`,
        kind: "contract_end",
        title: `Vertrag läuft aus: ${contract.name}`,
        subtitle: contract.provider,
        dueDate: contract.contractEndDate,
        urgencyDays,
        href: `/contracts/${contract.id}`,
        entityType: "contract",
        entityId: contract.id,
      });
    }
  }

  for (const raw of input.reminders) {
    const reminder = withDerivedReminderStatus(raw, referenceDate);
    if (reminder.status === "completed") continue;

    const due = startOfDay(parseISO(reminder.dueDate));
    const today = startOfDay(referenceDate);
    if (isAfter(due, today) && !withinAttentionWindow(reminder.dueDate, referenceDate)) {
      continue;
    }

    const urgencyDays = daysUntil(reminder.dueDate, referenceDate);
    if (urgencyDays > ATTENTION_WINDOW_DAYS) continue;

    items.push({
      id: `reminder:${reminder.id}`,
      kind: "reminder",
      title: reminder.title,
      dueDate: reminder.dueDate,
      urgencyDays,
      href: `/reminders/${reminder.id}`,
      entityType: "reminder",
      entityId: reminder.id,
    });
  }

  items.sort((a, b) => {
    if (a.urgencyDays !== b.urgencyDays) return a.urgencyDays - b.urgencyDays;
    return a.dueDate.localeCompare(b.dueDate);
  });

  return items;
}

export function buildUpcomingItems(input: DashboardInput): UpcomingItem[] {
  const referenceDate = input.referenceDate ?? new Date();
  const rows: UpcomingItem[] = [];

  const push = (date: string, id: string, title: string, subtitle: string | undefined, href: string) => {
    if (!withinUpcomingWindow(date, referenceDate)) return;
    rows.push({ id, date, title, subtitle, href });
  };

  for (const homeItem of input.homeItems) {
    if (homeItem.nextMaintenanceAt) {
      push(
        homeItem.nextMaintenanceAt,
        `upcoming-maintenance:${homeItem.id}`,
        homeItem.name,
        "Wartung",
        `/home/${homeItem.id}`,
      );
    }
    if (homeItem.warrantyEndsAt) {
      push(
        homeItem.warrantyEndsAt,
        `upcoming-warranty:${homeItem.id}`,
        homeItem.name,
        "Garantie endet",
        `/home/${homeItem.id}`,
      );
    }
  }

  for (const contract of input.contracts) {
    if (contract.nextCancellationDate) {
      push(
        contract.nextCancellationDate,
        `upcoming-cancel:${contract.id}`,
        contract.name,
        "Kündigung möglich",
        `/contracts/${contract.id}`,
      );
    }
    if (contract.contractEndDate) {
      push(
        contract.contractEndDate,
        `upcoming-end:${contract.id}`,
        contract.name,
        "Vertragsende",
        `/contracts/${contract.id}`,
      );
    }
  }

  for (const raw of input.reminders) {
    const reminder = withDerivedReminderStatus(raw, referenceDate);
    if (reminder.status === "completed") continue;
    const due = parseISO(reminder.dueDate);
    if (isBefore(due, startOfDay(referenceDate))) continue;
    push(
      reminder.dueDate,
      `upcoming-reminder:${reminder.id}`,
      reminder.title,
      "Reminder",
      `/reminders/${reminder.id}`,
    );
  }

  rows.sort((a, b) => a.date.localeCompare(b.date));
  return rows.slice(0, UPCOMING_MAX_ITEMS);
}
