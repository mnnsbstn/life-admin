import type { UUID } from "@/lib/domain/types";

export async function assertEntityInHousehold<T extends { householdId: UUID }>(
  getById: (id: UUID) => Promise<T | null>,
  id: UUID,
  householdId: UUID,
): Promise<T> {
  const entity = await getById(id);
  if (!entity || entity.householdId !== householdId) {
    throw new Error("Not found");
  }
  return entity;
}
