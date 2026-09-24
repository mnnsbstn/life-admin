import type {
  Contract,
  Document,
  HomeItem,
  Household,
  HouseholdMember,
  ID,
  Reminder,
  User,
} from "@/lib/domain/types";
import { createSeedSnapshot } from "@/lib/repositories/mock/seed";

export type MockStore = {
  user: User;
  household: Household;
  members: HouseholdMember[];
  homeItems: HomeItem[];
  contracts: Contract[];
  documents: Document[];
  reminders: Reminder[];
};

function cloneStore(source: MockStore): MockStore {
  return structuredClone(source);
}

let store: MockStore = cloneStore(createSeedSnapshot());

export function getMockStore(): MockStore {
  return store;
}

export function resetMockStore(): void {
  store = cloneStore(createSeedSnapshot());
}

export function generateId(prefix: string): ID {
  return `${prefix}-${crypto.randomUUID()}`;
}
