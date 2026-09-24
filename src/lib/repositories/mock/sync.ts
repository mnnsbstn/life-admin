import type { HouseholdDataSnapshot } from "@/lib/domain/types";
import type { SessionContext } from "@/lib/repositories/types";
import { getMockStore } from "@/lib/repositories/mock/store";

/** Synchronous read for client initial state (mock backend only). */
export function getMockSessionSync(): SessionContext {
  const store = getMockStore();
  return {
    user: store.user,
    household: store.household,
    members: [...store.members],
  };
}

export function getMockSnapshotSync(): HouseholdDataSnapshot {
  const store = getMockStore();
  return {
    user: store.user,
    household: store.household,
    members: [...store.members],
    homeItems: [...store.homeItems],
    contracts: [...store.contracts],
    documents: [...store.documents],
    reminders: [...store.reminders],
  };
}
