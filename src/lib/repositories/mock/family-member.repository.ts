import type { FamilyMemberRepository } from "@/lib/repositories/types";
import { getMockStore } from "@/lib/repositories/mock/mock-store";
import { newId, nowIso } from "@/lib/repositories/mock/utils";

export const mockFamilyMemberRepository: FamilyMemberRepository = {
  async list({ householdId }) {
    return getMockStore().familyMembers.filter(
      (m) => m.householdId === householdId,
    );
  },

  async getById(id) {
    return getMockStore().familyMembers.find((m) => m.id === id) ?? null;
  },

  async create(item) {
    const store = getMockStore();
    const created = {
      ...item,
      id: newId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    store.familyMembers.push(created);
    return created;
  },

  async update(id, patch) {
    const store = getMockStore();
    const index = store.familyMembers.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error(`FamilyMember not found: ${id}`);
    }
    const updated = {
      ...store.familyMembers[index],
      ...patch,
      id,
      updatedAt: nowIso(),
    };
    store.familyMembers[index] = updated;
    return updated;
  },

  async delete(id) {
    const store = getMockStore();
    const index = store.familyMembers.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error(`FamilyMember not found: ${id}`);
    }
    store.familyMembers.splice(index, 1);
  },
};
