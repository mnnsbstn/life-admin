import { z } from "zod";

import { optionalDateSchema } from "@/lib/domain/schemas/common";

export const contractCategorySchema = z.enum([
  "electricity",
  "internet",
  "mobile",
  "insurance",
  "streaming",
  "membership",
  "software",
  "other",
]);

export const paymentIntervalSchema = z.enum([
  "monthly",
  "quarterly",
  "yearly",
  "once",
]);

export const contractFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider: z.string().min(1, "Provider is required"),
  category: contractCategorySchema,
  costCents: z.coerce.number().int().nonnegative().optional(),
  paymentInterval: paymentIntervalSchema.optional(),
  startDate: optionalDateSchema,
  minimumTermMonths: z.coerce.number().int().positive().optional(),
  noticePeriodDays: z.coerce.number().int().nonnegative().optional(),
  nextCancellationDate: optionalDateSchema,
  contractEndDate: optionalDateSchema,
  autoRenewal: z.boolean(),
  notes: z.string().optional(),
});

export type ContractFormValues = z.infer<typeof contractFormSchema>;
