import { isBefore, parseISO, startOfDay } from "date-fns";

import type { Reminder, ReminderStatus } from "@/lib/domain/types";

export function resolveReminderStatus(
  reminder: Reminder,
  referenceDate: Date = startOfDay(new Date()),
): ReminderStatus {
  if (reminder.status === "completed" || reminder.completedAt) {
    return "completed";
  }

  const due = startOfDay(parseISO(reminder.dueDate));
  const ref = startOfDay(referenceDate);

  if (isBefore(due, ref)) return "due";
  if (due.getTime() === ref.getTime()) return "due";
  return "upcoming";
}
