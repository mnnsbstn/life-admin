import type { ReminderFormValues } from "@/lib/domain/schemas/reminder";
import type { Reminder } from "@/lib/domain/types";
import { resolveReminderStatus } from "@/lib/domain/reminders/reminder-status";
import { generateId, getMockStore } from "@/lib/repositories/mock/store";
import type { ReminderRepository } from "@/lib/repositories/types";

function normalizeReminderInput(input: ReminderFormValues) {
  return {
    ...input,
    homeItemId: input.homeItemId || undefined,
    contractId: input.contractId || undefined,
  };
}

export const mockReminderRepository: ReminderRepository = {
  async list(householdId) {
    return getMockStore().reminders.filter((r) => r.householdId === householdId);
  },

  async getById(id) {
    return getMockStore().reminders.find((r) => r.id === id) ?? null;
  },

  async create(householdId, input) {
    const store = getMockStore();
    const now = new Date().toISOString();
    const normalized = normalizeReminderInput(input);
    const base: Reminder = {
      id: generateId("rem"),
      householdId,
      title: normalized.title,
      dueDate: normalized.dueDate,
      priority: normalized.priority,
      homeItemId: normalized.homeItemId,
      contractId: normalized.contractId,
      notes: normalized.notes,
      status: "upcoming",
      createdAt: now,
      updatedAt: now,
    };
    base.status = resolveReminderStatus(base);
    store.reminders.push(base);
    return base;
  },

  async update(id, input) {
    const store = getMockStore();
    const index = store.reminders.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Reminder not found: ${id}`);
    const normalized = normalizeReminderInput(input);
    const updated: Reminder = {
      ...store.reminders[index],
      ...normalized,
      updatedAt: new Date().toISOString(),
    };
    if (updated.status !== "completed") {
      updated.status = resolveReminderStatus(updated);
    }
    store.reminders[index] = updated;
    return updated;
  },

  async complete(id) {
    const store = getMockStore();
    const index = store.reminders.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Reminder not found: ${id}`);
    const now = new Date().toISOString();
    const updated: Reminder = {
      ...store.reminders[index],
      status: "completed",
      completedAt: now,
      updatedAt: now,
    };
    store.reminders[index] = updated;
    return updated;
  },

  async remove(id) {
    const store = getMockStore();
    store.reminders = store.reminders.filter((r) => r.id !== id);
  },
};
