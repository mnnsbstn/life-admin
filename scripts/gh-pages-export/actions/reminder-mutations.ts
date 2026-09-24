import type { ReminderFormValues } from "@/features/reminders/schemas/reminder.schema";

async function blocked(): Promise<never> {
  throw new Error("Read-only GitHub Pages demo");
}

export async function createReminderAction(_values: ReminderFormValues) {
  return blocked();
}

export async function updateReminderAction(
  _id: string,
  _values: ReminderFormValues,
) {
  return blocked();
}
