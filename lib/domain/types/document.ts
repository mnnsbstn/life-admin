import { z } from "zod";
import { documentTypes } from "../enums";

export const documentSchema = z.object({
  id: z.string(),
  householdId: z.string(),
  title: z.string().min(1),
  type: z.enum(documentTypes),
  homeItemId: z.string().optional().nullable(),
  contractId: z.string().optional().nullable(),
  fileName: z.string().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  sizeBytes: z.number().optional().nullable(),
  storagePath: z.string().optional().nullable(),
  issuedAt: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Document = z.infer<typeof documentSchema>;

export const documentFormSchema = documentSchema
  .omit({ id: true, householdId: true, createdAt: true, updatedAt: true })
  .extend({
    sizeBytes: z.coerce.number().optional().nullable(),
    homeItemId: z.string().optional().nullable(),
    contractId: z.string().optional().nullable(),
  });

export type DocumentFormValues = z.infer<typeof documentFormSchema>;
