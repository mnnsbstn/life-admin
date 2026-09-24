import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().min(1),
  avatarUrl: z.string().url().optional().nullable(),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof userSchema>;
