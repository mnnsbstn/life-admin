import { z } from "zod";
import { homeCategories } from "../enums";

export const homeItemSchema = z.object({
  id: z.string(),
  householdId: z.string(),
  name: z.string().min(1),
  category: z.enum(homeCategories),
  manufacturer: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  purchaseDate: z.string().optional().nullable(),
  installationDate: z.string().optional().nullable(),
  purchasePrice: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  warrantyEndsAt: z.string().optional().nullable(),
  lastMaintenanceAt: z.string().optional().nullable(),
  nextMaintenanceAt: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type HomeItem = z.infer<typeof homeItemSchema>;

export const homeItemFormSchema = homeItemSchema
  .omit({ id: true, householdId: true, createdAt: true, updatedAt: true })
  .extend({
    purchasePrice: z.coerce.number().optional().nullable(),
  });

export type HomeItemFormValues = z.infer<typeof homeItemFormSchema>;
