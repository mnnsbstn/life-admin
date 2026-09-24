import { z } from "zod";

import { requiredText } from "@/lib/forms/zod-helpers";

const categories = [
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
] as const;

export const homeItemSchema = z.object({
  name: requiredText,
  category: z.enum(categories),
  manufacturer: z.string(),
  model: z.string(),
  serialNumber: z.string(),
  location: z.string(),
  purchaseDate: z.string(),
  installationDate: z.string(),
  purchasePriceEuro: z.string(),
  warrantyEndsAt: z.string(),
  lastMaintenanceAt: z.string(),
  nextMaintenanceAt: z.string(),
  notes: z.string(),
});

export type HomeItemFormValues = z.infer<typeof homeItemSchema>;
