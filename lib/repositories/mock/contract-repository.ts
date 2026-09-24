import type { ContractFormValues } from "@/lib/domain/types/contract";
import type { IContractRepository } from "../types";
import { getMockStore } from "./store";

export const mockContractRepository: IContractRepository = {
  list(householdId) {
    return getMockStore().contracts.filter((c) => c.householdId === householdId);
  },
  getById(id) {
    return getMockStore().contracts.find((c) => c.id === id);
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
    getMockStore().contracts.push(item);
    return item;
  },
  update(id, data) {
    const store = getMockStore();
    const idx = store.contracts.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    const updated = {
      ...store.contracts[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    store.contracts[idx] = updated;
    return updated;
  },
  delete(id) {
    const store = getMockStore();
    const before = store.contracts.length;
    store.contracts = store.contracts.filter((c) => c.id !== id);
    return store.contracts.length < before;
  },
};
