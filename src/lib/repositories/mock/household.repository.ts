import type { HouseholdRepository } from "@/lib/repositories/types";
import { getMockStore } from "@/lib/repositories/mock/mock-store";

export const mockHouseholdRepository: HouseholdRepository = {
  async getById(id) {
    const { household } = getMockStore();
    return household.id === id ? household : null;
  },

  async getForUser(userId) {
    const store = getMockStore();
    if (store.householdMember.userId !== userId) {
      return [];
    }
    return [store.household];
  },
};
