import { z } from "zod";
import { householdRoles } from "../enums";

export const householdSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  createdAt: z.string().datetime(),
});

export type Household = z.infer<typeof householdSchema>;

export const householdMemberSchema = z.object({
  id: z.string(),
  householdId: z.string(),
  userId: z.string(),
  role: z.enum(householdRoles),
  joinedAt: z.string().datetime(),
});

export type HouseholdMember = z.infer<typeof householdMemberSchema>;
