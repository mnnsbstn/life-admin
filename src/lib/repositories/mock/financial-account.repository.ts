import type { FinancialAccountRepository } from "@/lib/repositories/types";
import { getMockStore } from "@/lib/repositories/mock/mock-store";
import { newId, nowIso } from "@/lib/repositories/mock/utils";

export const mockFinancialAccountRepository: FinancialAccountRepository = {
  async list({ householdId }) {
    return getMockStore().financialAccounts.filter(
      (a) => a.householdId === householdId,
    );
  },

  async getById(id) {
    return getMockStore().financialAccounts.find((a) => a.id === id) ?? null;
  },

  async create(item) {
    const store = getMockStore();
    const created = {
      ...item,
      id: newId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    store.financialAccounts.push(created);
    return created;
  },

  async update(id, patch) {
    const store = getMockStore();
    const index = store.financialAccounts.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`FinancialAccount not found: ${id}`);
    }
    const updated = {
      ...store.financialAccounts[index],
      ...patch,
      id,
      updatedAt: nowIso(),
    };
    store.financialAccounts[index] = updated;
    return updated;
  },

  async delete(id) {
    const store = getMockStore();
    const index = store.financialAccounts.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`FinancialAccount not found: ${id}`);
    }
    store.financialAccounts.splice(index, 1);
  },
};
