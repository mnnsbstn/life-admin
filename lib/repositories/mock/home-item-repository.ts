import type { HomeItemFormValues } from "@/lib/domain/types/home-item";
import type { IHomeItemRepository } from "../types";
import { getMockStore } from "./store";

export const mockHomeItemRepository: IHomeItemRepository = {
  list(householdId) {
    return getMockStore().homeItems.filter((i) => i.householdId === householdId);
  },
  getById(id) {
    return getMockStore().homeItems.find((i) => i.id === id);
  },
  create(householdId, data) {
    const now = new Date().toISOString();
    const item = {
      id: crypto.randomUUID(),
      householdId,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    getMockStore().homeItems.push(item);
    return item;
  },
  update(id, data) {
    const store = getMockStore();
    const idx = store.homeItems.findIndex((i) => i.id === id);
    if (idx === -1) return undefined;
    const updated = {
      ...store.homeItems[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    store.homeItems[idx] = updated;
    return updated;
  },
  delete(id) {
    const store = getMockStore();
    const before = store.homeItems.length;
    store.homeItems = store.homeItems.filter((i) => i.id !== id);
    return store.homeItems.length < before;
  },
};
