import type { ReminderFormValues } from "@/lib/domain/types/reminder";
import type { IReminderRepository } from "../types";
import { getMockStore } from "./store";
import { resolveReminderStatus } from "@/lib/services/reminder-status";

export const mockReminderRepository: IReminderRepository = {
  list(householdId) {
    return getMockStore()
      .reminders.filter((r) => r.householdId === householdId)
      .map((r) => ({
        ...r,
        status: resolveReminderStatus(r),
      }));
  },
  getById(id) {
    const r = getMockStore().reminders.find((x) => x.id === id);
    if (!r) return undefined;
    return { ...r, status: resolveReminderStatus(r) };
  },
  create(householdId, data) {
    const now = new Date().toISOString();
    const item = {
      id: crypto.randomUUID(),
      householdId,
      ...data,
      status: resolveReminderStatus({ ...data, status: data.status }),
      createdAt: now,
      updatedAt: now,
    };
    getMockStore().reminders.push(item);
    return item;
  },
  update(id, data) {
    const store = getMockStore();
    const idx = store.reminders.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    const merged = {
      ...store.reminders[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    merged.status = resolveReminderStatus(merged);
    store.reminders[idx] = merged;
    return merged;
  },
  delete(id) {
    const store = getMockStore();
    const before = store.reminders.length;
    store.reminders = store.reminders.filter((r) => r.id !== id);
    return store.reminders.length < before;
  },
};
