import type { ReminderFormValues } from "@/features/reminders/schemas/reminder.schema";
import type { Reminder } from "@/lib/domain/types";

export function reminderToFormValues(reminder: Reminder): ReminderFormValues {
  return {
    title: reminder.title,
    dueDate: reminder.dueDate,
    priority: reminder.priority,
    linkType:
      reminder.link.type === "home_item"
        ? "home_item"
        : reminder.link.type === "contract"
          ? "contract"
          : "standalone",
    linkTargetId:
      reminder.link.type === "standalone" ? "" : reminder.link.id,
    notes: reminder.notes ?? "",
  };
}

export const emptyReminderFormValues: ReminderFormValues = {
  title: "",
  dueDate: "",
  priority: "medium",
  linkType: "standalone",
  linkTargetId: "",
  notes: "",
};
