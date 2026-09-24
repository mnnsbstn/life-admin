import { z } from "zod";
import { contractCategories, costIntervals } from "../enums";

export const contractSchema = z.object({
  id: z.string(),
  householdId: z.string(),
  name: z.string().min(1),
  provider: z.string().min(1),
  category: z.enum(contractCategories),
  cost: z.number().optional().nullable(),
  costInterval: z.enum(costIntervals).optional().nullable(),
  startDate: z.string().optional().nullable(),
  minimumTermMonths: z.number().int().optional().nullable(),
  noticePeriodDays: z.number().int().optional().nullable(),
  autoRenewal: z.boolean().optional().nullable(),
  renewalPeriodMonths: z.number().int().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Contract = z.infer<typeof contractSchema>;

export const contractFormSchema = contractSchema
  .omit({ id: true, householdId: true, createdAt: true, updatedAt: true })
  .extend({
    cost: z.coerce.number().optional().nullable(),
    minimumTermMonths: z.coerce.number().int().optional().nullable(),
    noticePeriodDays: z.coerce.number().int().optional().nullable(),
    renewalPeriodMonths: z.coerce.number().int().optional().nullable(),
    autoRenewal: z.boolean().optional().nullable(),
  });

export type ContractFormValues = z.infer<typeof contractFormSchema>;
