import { z } from "zod";

import { requiredText } from "@/lib/forms/zod-helpers";

const accountTypes = [
  "checking",
  "savings",
  "investment",
  "credit",
  "cash",
  "other",
] as const;

export const financialAccountSchema = z.object({
  name: requiredText,
  accountType: z.enum(accountTypes),
  institution: z.string(),
  ibanLast4: z.string(),
  notes: z.string(),
});

export type FinancialAccountFormValues = z.infer<typeof financialAccountSchema>;
