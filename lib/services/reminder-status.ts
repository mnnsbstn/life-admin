import type { Reminder } from "@/lib/domain/types/reminder";
import type { ReminderStatus } from "@/lib/domain/enums";

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function parseDateOnly(iso: string): Date {
  return new Date(`${iso}T12:00:00`);
}

export function resolveReminderStatus(
  reminder: Pick<Reminder, "dueDate" | "status" | "completedAt">,
): ReminderStatus {
  if (reminder.status === "completed" || reminder.completedAt) {
    return "completed";
  }
  const due = parseDateOnly(reminder.dueDate);
  const today = startOfToday();
  if (due.getTime() <= today.getTime()) {
    return "due";
  }
  return "upcoming";
}
