import type { MockSeedData } from "@/lib/repositories/mock/seed";
import { createSeedData } from "@/lib/repositories/mock/seed";

let store: MockSeedData | null = null;

export function getMockStore(): MockSeedData {
  if (!store) {
    store = createSeedData();
  }
  return store;
}

/** Reset in-memory data (tests / dev) */
export function resetMockStore(): void {
  store = createSeedData();
}
