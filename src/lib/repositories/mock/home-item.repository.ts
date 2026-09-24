import type { HomeItemRepository } from "@/lib/repositories/types";
import { getMockStore } from "@/lib/repositories/mock/mock-store";
import { newId, nowIso } from "@/lib/repositories/mock/utils";

export const mockHomeItemRepository: HomeItemRepository = {
  async list({ householdId }) {
    return getMockStore().homeItems.filter((i) => i.householdId === householdId);
  },

  async getById(id) {
    return getMockStore().homeItems.find((i) => i.id === id) ?? null;
  },

  async create(item) {
    const store = getMockStore();
    const created = {
      ...item,
      id: newId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    store.homeItems.push(created);
    return created;
  },

  async update(id, patch) {
    const store = getMockStore();
    const index = store.homeItems.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`HomeItem not found: ${id}`);
    }
    const updated = {
      ...store.homeItems[index],
      ...patch,
      id,
      updatedAt: nowIso(),
    };
    store.homeItems[index] = updated;
    return updated;
  },

  async delete(id) {
    const store = getMockStore();
    const index = store.homeItems.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`HomeItem not found: ${id}`);
    }
    store.homeItems.splice(index, 1);
  },
};
