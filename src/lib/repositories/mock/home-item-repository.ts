import type { HomeItemFormValues } from "@/lib/domain/schemas/home-item";
import type { HomeItem } from "@/lib/domain/types";
import { generateId, getMockStore } from "@/lib/repositories/mock/store";
import type { HomeItemRepository } from "@/lib/repositories/types";
function normalizeOptionalDates(input: HomeItemFormValues) {
  return {
    ...input,
    purchaseDate: input.purchaseDate || undefined,
    installationDate: input.installationDate || undefined,
    warrantyEndDate: input.warrantyEndDate || undefined,
    lastMaintenanceDate: input.lastMaintenanceDate || undefined,
    nextMaintenanceDate: input.nextMaintenanceDate || undefined,
  };
}

export const mockHomeItemRepository: HomeItemRepository = {
  async list(householdId) {
    return getMockStore().homeItems.filter((i) => i.householdId === householdId);
  },

  async getById(id) {
    return getMockStore().homeItems.find((i) => i.id === id) ?? null;
  },

  async create(householdId, input) {
    const store = getMockStore();
    const now = new Date().toISOString();
    const normalized = normalizeOptionalDates(input);
    const item: HomeItem = {
      id: generateId("home"),
      householdId,
      name: normalized.name,
      category: normalized.category,
      manufacturer: normalized.manufacturer,
      model: normalized.model,
      serialNumber: normalized.serialNumber,
      location: normalized.location,
      purchaseDate: normalized.purchaseDate,
      installationDate: normalized.installationDate,
      purchasePriceCents: normalized.purchasePriceCents,
      warrantyEndDate: normalized.warrantyEndDate,
      lastMaintenanceDate: normalized.lastMaintenanceDate,
      nextMaintenanceDate: normalized.nextMaintenanceDate,
      notes: normalized.notes,
      createdAt: now,
      updatedAt: now,
    };
    store.homeItems.push(item);
    return item;
  },

  async update(id, input) {
    const store = getMockStore();
    const index = store.homeItems.findIndex((i) => i.id === id);
    if (index === -1) throw new Error(`Home item not found: ${id}`);
    const normalized = normalizeOptionalDates(input);
    const updated: HomeItem = {
      ...store.homeItems[index],
      ...normalized,
      updatedAt: new Date().toISOString(),
    };
    store.homeItems[index] = updated;
    return updated;
  },

  async remove(id) {
    const store = getMockStore();
    store.homeItems = store.homeItems.filter((i) => i.id !== id);
    store.documents = store.documents.map((d) =>
      d.homeItemId === id ? { ...d, homeItemId: undefined } : d,
    );
    store.reminders = store.reminders.map((r) =>
      r.homeItemId === id ? { ...r, homeItemId: undefined } : r,
    );
  },
};
