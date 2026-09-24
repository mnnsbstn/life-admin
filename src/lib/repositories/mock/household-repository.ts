import type { HouseholdDataSnapshot, ID } from "@/lib/domain/types";
import type { HouseholdRepository, SessionContext } from "@/lib/repositories/types";
import { getMockStore } from "@/lib/repositories/mock/store";

export const mockHouseholdRepository: HouseholdRepository = {
  async getSession(): Promise<SessionContext> {
    const store = getMockStore();
    return {
      user: store.user,
      household: store.household,
      members: [...store.members],
    };
  },

  async getSnapshot(householdId: ID): Promise<HouseholdDataSnapshot> {
    const store = getMockStore();
    if (store.household.id !== householdId) {
      throw new Error(`Unknown household: ${householdId}`);
    }

    return {
      user: store.user,
      household: store.household,
      members: [...store.members],
      homeItems: [...store.homeItems],
      contracts: [...store.contracts],
      documents: [...store.documents],
      reminders: [...store.reminders],
    };
  },
};
