import type { FamilyMemberFormValues } from "@/features/family/schemas/family-member.schema";

async function blocked(): Promise<never> {
  throw new Error("Read-only GitHub Pages demo");
}

export async function createFamilyMemberAction(_values: FamilyMemberFormValues) {
  return blocked();
}

export async function updateFamilyMemberAction(
  _id: string,
  _values: FamilyMemberFormValues,
) {
  return blocked();
}

export async function deleteFamilyMemberAction(_id: string) {
  return blocked();
}
