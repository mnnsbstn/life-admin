import type { FamilyMember, FamilyRelationship } from "@/lib/domain/types";

export interface FamilyMemberRow {
  id: string;
  household_id: string;
  name: string;
  relationship: FamilyRelationship;
  email: string | null;
  phone: string | null;
  birthday: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function mapFamilyMemberRow(row: FamilyMemberRow): FamilyMember {
  return {
    id: row.id,
    householdId: row.household_id,
    name: row.name,
    relationship: row.relationship,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    birthday: row.birthday ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapFamilyMemberToRow(
  item: Omit<FamilyMember, "id" | "createdAt" | "updatedAt">,
): Omit<FamilyMemberRow, "id" | "created_at" | "updated_at"> {
  return {
    household_id: item.householdId,
    name: item.name,
    relationship: item.relationship,
    email: item.email ?? null,
    phone: item.phone ?? null,
    birthday: item.birthday ?? null,
    notes: item.notes ?? null,
  };
}
