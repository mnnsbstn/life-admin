import type { FamilyMemberFormValues } from "@/features/family/schemas/family-member.schema";
import type { FamilyMember } from "@/lib/domain/types";

export function familyMemberToFormValues(
  member: FamilyMember,
): FamilyMemberFormValues {
  return {
    name: member.name,
    relationship: member.relationship,
    email: member.email ?? "",
    phone: member.phone ?? "",
    birthday: member.birthday ?? "",
    notes: member.notes ?? "",
  };
}

export const emptyFamilyMemberFormValues: FamilyMemberFormValues = {
  name: "",
  relationship: "partner",
  email: "",
  phone: "",
  birthday: "",
  notes: "",
};
