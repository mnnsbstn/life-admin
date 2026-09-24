import { z } from "zod";

import { optionalDateSchema } from "@/lib/domain/schemas/common";

export const documentTypeSchema = z.enum([
  "invoice",
  "contract",
  "manual",
  "warranty",
  "insurance",
  "certificate",
  "receipt",
  "other",
]);

export const documentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: documentTypeSchema,
  fileName: z.string().optional(),
  homeItemId: z.string().optional(),
  contractId: z.string().optional(),
  issuedDate: optionalDateSchema,
  notes: z.string().optional(),
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;
