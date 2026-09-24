import { isBefore, parseISO, startOfDay } from "date-fns";

import type { Reminder, ReminderStatus } from "@/lib/domain/types";

export function deriveReminderStatus(
  dueDate: string,
  completedAt?: string,
  referenceDate: Date = new Date(),
): ReminderStatus {
  if (completedAt) {
    return "completed";
  }

  const due = startOfDay(parseISO(dueDate));
  const today = startOfDay(referenceDate);

  if (isBefore(due, today)) {
    return "due";
  }

  if (due.getTime() === today.getTime()) {
    return "due";
  }

  return "upcoming";
}

export function withDerivedReminderStatus(
  reminder: Reminder,
  referenceDate: Date = new Date(),
): Reminder {
  const status = deriveReminderStatus(
    reminder.dueDate,
    reminder.completedAt,
    referenceDate,
  );

  return { ...reminder, status };
}
