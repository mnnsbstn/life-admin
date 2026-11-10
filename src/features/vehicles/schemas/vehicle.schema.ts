import { z } from "zod";

import { requiredText } from "@/lib/forms/zod-helpers";

const kinds = ["car", "motorcycle", "bicycle", "camper", "other"] as const;

export const vehicleSchema = z.object({
  name: requiredText,
  kind: z.enum(kinds),
  make: z.string(),
  model: z.string(),
  licensePlate: z.string(),
  year: z.string(),
  nextInspectionAt: z.string(),
  insuranceEndsAt: z.string(),
  notes: z.string(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
