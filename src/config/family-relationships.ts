import type { FamilyRelationship } from "@/lib/domain/types";

export const familyRelationshipLabels: Record<FamilyRelationship, string> = {
  partner: "Partner/in",
  child: "Kind",
  parent: "Elternteil",
  sibling: "Geschwister",
  relative: "Verwandte/r",
  friend: "Freund/in",
  other: "Sonstiges",
};
