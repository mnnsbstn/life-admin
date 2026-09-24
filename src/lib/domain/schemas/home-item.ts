import { z } from "zod";

import { optionalDateSchema } from "@/lib/domain/schemas/common";

export const homeCategorySchema = z.enum([
  "heating",
  "electricity",
  "water",
  "internet",
  "appliances",
  "kitchen",
  "bathroom",
  "smart_home",
  "garden",
  "renovation",
  "other",
]);

export const homeItemFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: homeCategorySchema,
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  location: z.string().optional(),
  purchaseDate: optionalDateSchema,
  installationDate: optionalDateSchema,
  purchasePriceCents: z.coerce.number().int().nonnegative().optional(),
  warrantyEndDate: optionalDateSchema,
  lastMaintenanceDate: optionalDateSchema,
  nextMaintenanceDate: optionalDateSchema,
  notes: z.string().optional(),
});

export type HomeItemFormValues = z.infer<typeof homeItemFormSchema>;
