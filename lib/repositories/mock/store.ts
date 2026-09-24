import type { HomeItem } from "@/lib/domain/types/home-item";
import type { Contract } from "@/lib/domain/types/contract";
import type { Document } from "@/lib/domain/types/document";
import type { Reminder } from "@/lib/domain/types/reminder";
import type { User } from "@/lib/domain/types/user";
import type { Household, HouseholdMember } from "@/lib/domain/types/household";
import { createSeedData } from "./seed";

export type MockStoreData = {
  users: User[];
  households: Household[];
  householdMembers: HouseholdMember[];
  homeItems: HomeItem[];
  contracts: Contract[];
  documents: Document[];
  reminders: Reminder[];
};

declare global {
  // eslint-disable-next-line no-var
  var __lifeAdminMockStore: MockStoreData | undefined;
}

export function getMockStore(): MockStoreData {
  if (!globalThis.__lifeAdminMockStore) {
    globalThis.__lifeAdminMockStore = createSeedData();
  }
  return globalThis.__lifeAdminMockStore;
}

export function resetMockStore(): void {
  globalThis.__lifeAdminMockStore = createSeedData();
}

export const DEMO_HOUSEHOLD_ID = "hh-001";
export const DEMO_USER_ID = "user-alex";
