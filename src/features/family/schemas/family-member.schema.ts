import { z } from "zod";

import { requiredText } from "@/lib/forms/zod-helpers";

const relationships = [
  "partner",
  "child",
  "parent",
  "sibling",
  "relative",
  "friend",
  "other",
] as const;

export const familyMemberSchema = z.object({
  name: requiredText,
  relationship: z.enum(relationships),
  email: z.string(),
  phone: z.string(),
  birthday: z.string(),
  notes: z.string(),
});

export type FamilyMemberFormValues = z.infer<typeof familyMemberSchema>;
