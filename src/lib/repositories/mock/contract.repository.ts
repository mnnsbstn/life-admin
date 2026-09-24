import type { ContractRepository } from "@/lib/repositories/types";
import { getMockStore } from "@/lib/repositories/mock/mock-store";
import { newId, nowIso } from "@/lib/repositories/mock/utils";

export const mockContractRepository: ContractRepository = {
  async list({ householdId }) {
    return getMockStore().contracts.filter((c) => c.householdId === householdId);
  },

  async getById(id) {
    return getMockStore().contracts.find((c) => c.id === id) ?? null;
  },

  async create(item) {
    const store = getMockStore();
    const created = {
      ...item,
      id: newId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    store.contracts.push(created);
    return created;
  },

  async update(id, patch) {
    const store = getMockStore();
    const index = store.contracts.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Contract not found: ${id}`);
    }
    const updated = {
      ...store.contracts[index],
      ...patch,
      id,
      updatedAt: nowIso(),
    };
    store.contracts[index] = updated;
    return updated;
  },

  async delete(id) {
    const store = getMockStore();
    const index = store.contracts.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Contract not found: ${id}`);
    }
    store.contracts.splice(index, 1);
  },
};
