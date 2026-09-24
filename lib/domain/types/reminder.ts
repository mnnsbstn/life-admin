import { z } from "zod";
import { reminderPriorities, reminderStatuses } from "../enums";

export const reminderSchema = z.object({
  id: z.string(),
  householdId: z.string(),
  title: z.string().min(1),
  dueDate: z.string(),
  status: z.enum(reminderStatuses),
  priority: z.enum(reminderPriorities),
  homeItemId: z.string().optional().nullable(),
  contractId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Reminder = z.infer<typeof reminderSchema>;

export const reminderFormSchema = reminderSchema
  .omit({ id: true, householdId: true, createdAt: true, updatedAt: true })
  .extend({
    homeItemId: z.string().optional().nullable(),
    contractId: z.string().optional().nullable(),
  });

export type ReminderFormValues = z.infer<typeof reminderFormSchema>;
