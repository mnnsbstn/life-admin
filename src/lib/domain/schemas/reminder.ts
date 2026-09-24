import { z } from "zod";

import { requiredDateSchema } from "@/lib/domain/schemas/common";

export const reminderFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueDate: requiredDateSchema,
  priority: z.enum(["low", "medium", "high"]),
  homeItemId: z.string().optional(),
  contractId: z.string().optional(),
  notes: z.string().optional(),
});

export type ReminderFormValues = z.infer<typeof reminderFormSchema>;
