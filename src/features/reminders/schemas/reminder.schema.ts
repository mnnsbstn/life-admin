import { z } from "zod";

import { requiredText } from "@/lib/forms/zod-helpers";

const priorities = ["low", "medium", "high"] as const;
const linkTypes = ["standalone", "home_item", "contract"] as const;

export const reminderSchema = z.object({
  title: requiredText,
  dueDate: z.string().min(1, "Datum erforderlich"),
  priority: z.enum(priorities),
  linkType: z.enum(linkTypes),
  linkTargetId: z.string(),
  notes: z.string(),
});

export type ReminderFormValues = z.infer<typeof reminderSchema>;
