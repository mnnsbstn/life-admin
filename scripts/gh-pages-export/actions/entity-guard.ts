import type { UUID } from "@/lib/domain/types";

export async function assertEntityInHousehold<T extends { householdId: UUID }>(
  _load: (id: UUID) => Promise<T | null>,
  _id: UUID,
  _householdId: UUID,
): Promise<T> {
  throw new Error("Read-only GitHub Pages demo");
}
