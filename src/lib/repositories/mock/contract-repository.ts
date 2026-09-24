import type { ContractFormValues } from "@/lib/domain/schemas/contract";
import type { Contract, ID } from "@/lib/domain/types";
import { generateId, getMockStore } from "@/lib/repositories/mock/store";
import type { ContractRepository } from "@/lib/repositories/types";

function normalizeContractInput(input: ContractFormValues) {
  return {
    ...input,
    startDate: input.startDate || undefined,
    nextCancellationDate: input.nextCancellationDate || undefined,
    contractEndDate: input.contractEndDate || undefined,
  };
}

export const mockContractRepository: ContractRepository = {
  async list(householdId) {
    return getMockStore().contracts.filter((c) => c.householdId === householdId);
  },

  async getById(id) {
    return getMockStore().contracts.find((c) => c.id === id) ?? null;
  },

  async create(householdId, input) {
    const store = getMockStore();
    const now = new Date().toISOString();
    const normalized = normalizeContractInput(input);
    const contract: Contract = {
      id: generateId("contract"),
      householdId,
      name: normalized.name,
      provider: normalized.provider,
      category: normalized.category,
      costCents: normalized.costCents,
      paymentInterval: normalized.paymentInterval,
      startDate: normalized.startDate,
      minimumTermMonths: normalized.minimumTermMonths,
      noticePeriodDays: normalized.noticePeriodDays,
      nextCancellationDate: normalized.nextCancellationDate,
      contractEndDate: normalized.contractEndDate,
      autoRenewal: normalized.autoRenewal,
      notes: normalized.notes,
      createdAt: now,
      updatedAt: now,
    };
    store.contracts.push(contract);
    return contract;
  },

  async update(id, input) {
    const store = getMockStore();
    const index = store.contracts.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Contract not found: ${id}`);
    const normalized = normalizeContractInput(input);
    const updated: Contract = {
      ...store.contracts[index],
      ...normalized,
      updatedAt: new Date().toISOString(),
    };
    store.contracts[index] = updated;
    return updated;
  },

  async remove(id) {
    const store = getMockStore();
    store.contracts = store.contracts.filter((c) => c.id !== id);
    store.documents = store.documents.map((d) =>
      d.contractId === id ? { ...d, contractId: undefined } : d,
    );
    store.reminders = store.reminders.map((r) =>
      r.contractId === id ? { ...r, contractId: undefined } : r,
    );
  },
};
