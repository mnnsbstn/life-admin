import { z } from "zod";

import { requiredText } from "@/lib/forms/zod-helpers";

const categories = [
  "electricity",
  "internet",
  "mobile",
  "insurance",
  "streaming",
  "membership",
  "software",
  "other",
] as const;

const intervals = ["monthly", "quarterly", "yearly", "once"] as const;

export const contractSchema = z.object({
  name: requiredText,
  provider: requiredText,
  category: z.enum(categories),
  costEuro: z.string(),
  paymentInterval: z.union([z.enum(intervals), z.literal("")]),
  startDate: z.string(),
  minimumTermMonths: z.string(),
  noticePeriodDays: z.string(),
  nextCancellationDate: z.string(),
  contractEndDate: z.string(),
  autoRenewal: z.boolean(),
  notes: z.string(),
});

export type ContractFormValues = z.infer<typeof contractSchema>;
