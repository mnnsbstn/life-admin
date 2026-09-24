import { withDerivedReminderStatus } from "@/lib/domain/reminder-status";
import type { ReminderRepository } from "@/lib/repositories/types";
import { getMockStore } from "@/lib/repositories/mock/mock-store";
import { newId, nowIso } from "@/lib/repositories/mock/utils";

export const mockReminderRepository: ReminderRepository = {
  async list({ householdId }) {
    return getMockStore()
      .reminders.filter((r) => r.householdId === householdId)
      .map((r) => withDerivedReminderStatus(r));
  },

  async getById(id) {
    const reminder = getMockStore().reminders.find((r) => r.id === id);
    return reminder ? withDerivedReminderStatus(reminder) : null;
  },

  async create(item) {
    const store = getMockStore();
    const created = withDerivedReminderStatus({
      ...item,
      id: newId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    store.reminders.push(created);
    return created;
  },

  async update(id, patch) {
    const store = getMockStore();
    const index = store.reminders.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Reminder not found: ${id}`);
    }
    const updated = withDerivedReminderStatus({
      ...store.reminders[index],
      ...patch,
      id,
      updatedAt: nowIso(),
    });
    store.reminders[index] = updated;
    return updated;
  },
};
