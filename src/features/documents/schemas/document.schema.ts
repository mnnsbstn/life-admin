import { z } from "zod";

import { requiredText } from "@/lib/forms/zod-helpers";

const documentTypes = [
  "invoice",
  "contract",
  "manual",
  "warranty",
  "insurance",
  "certificate",
  "receipt",
  "other",
] as const;

const linkTypes = ["none", "home_item", "contract"] as const;

export const documentSchema = z.object({
  title: requiredText,
  documentType: z.enum(documentTypes),
  issuedAt: z.string(),
  mockFileName: z.string(),
  linkType: z.enum(linkTypes),
  linkTargetId: z.string(),
  notes: z.string(),
});

export type DocumentFormValues = z.infer<typeof documentSchema>;
