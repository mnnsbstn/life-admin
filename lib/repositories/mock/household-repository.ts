import type { IHouseholdRepository } from "../types";
import { DEMO_HOUSEHOLD_ID, getMockStore } from "./store";

export const mockHouseholdRepository: IHouseholdRepository = {
  getDemoHousehold() {
    const h = getMockStore().households.find((x) => x.id === DEMO_HOUSEHOLD_ID);
    if (!h) throw new Error("Demo household missing from seed");
    return h;
  },
  getMembers(householdId) {
    return getMockStore().householdMembers.filter((m) => m.householdId === householdId);
  },
};
