import type { ContractFormValues } from "@/features/contracts/schemas/contract.schema";
import type { DocumentFormValues } from "@/features/documents/schemas/document.schema";
import type { ReminderFormValues } from "@/features/reminders/schemas/reminder.schema";

export type SmartCaptureSource = "heuristic" | "llm";

export interface SmartCaptureResult {
  source: SmartCaptureSource;
  summary: string;
  document?: Partial<DocumentFormValues>;
  contract?: Partial<ContractFormValues>;
  reminder?: Partial<ReminderFormValues>;
}

export const SMART_CAPTURE_SESSION_KEYS = {
  document: "la-smart-capture-document",
  contract: "la-smart-capture-contract",
  reminder: "la-smart-capture-reminder",
} as const;
