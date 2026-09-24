import { parseISO } from "date-fns";

import type { Contract, HomeItem, Reminder } from "@/lib/domain/types";
import { withDerivedReminderStatus } from "@/lib/domain/reminder-status";

function nextRelevantDate(item: HomeItem): number | null {
  const dates = [item.nextMaintenanceAt, item.warrantyEndsAt].filter(Boolean);
  if (dates.length === 0) return null;
  return Math.min(...dates.map((d) => parseISO(d!).getTime()));
}

export function sortHomeItems(items: HomeItem[]): HomeItem[] {
  return [...items].sort((a, b) => {
    const aDate = nextRelevantDate(a);
    const bDate = nextRelevantDate(b);
    if (aDate != null && bDate != null && aDate !== bDate) return aDate - bDate;
    if (aDate != null && bDate == null) return -1;
    if (aDate == null && bDate != null) return 1;
    return a.name.localeCompare(b.name, "de");
  });
}

export function sortContracts(items: Contract[]): Contract[] {
  return [...items].sort((a, b) => {
    const aDate = a.nextCancellationDate ?? a.contractEndDate;
    const bDate = b.nextCancellationDate ?? b.contractEndDate;
    if (aDate && bDate) return aDate.localeCompare(bDate);
    if (aDate) return -1;
    if (bDate) return 1;
    return a.name.localeCompare(b.name, "de");
  });
}

export function sortReminders(items: Reminder[]): Reminder[] {
  return [...items].sort((a, b) => {
    const aStatus = withDerivedReminderStatus(a);
    const bStatus = withDerivedReminderStatus(b);
    const rank = (s: typeof aStatus.status) =>
      s === "due" ? 0 : s === "upcoming" ? 1 : 2;
    if (rank(aStatus.status) !== rank(bStatus.status)) {
      return rank(aStatus.status) - rank(bStatus.status);
    }
    return a.dueDate.localeCompare(b.dueDate);
  });
}
