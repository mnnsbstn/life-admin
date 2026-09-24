import { mockContractRepository } from "@/lib/repositories/mock/contract-repository";
import { mockDocumentRepository } from "@/lib/repositories/mock/document-repository";
import { mockHomeItemRepository } from "@/lib/repositories/mock/home-item-repository";
import { mockHouseholdRepository } from "@/lib/repositories/mock/household-repository";
import { mockReminderRepository } from "@/lib/repositories/mock/reminder-repository";
import type { Repositories } from "@/lib/repositories/types";

export type DataBackend = "mock" | "supabase";

let backend: DataBackend = "mock";

export function setDataBackend(next: DataBackend) {
  backend = next;
}

export function getRepositories(): Repositories {
  if (backend === "supabase") {
    throw new Error(
      "Supabase repositories are not configured yet. Use mock backend for V0.1.",
    );
  }

  return {
    household: mockHouseholdRepository,
    homeItems: mockHomeItemRepository,
    contracts: mockContractRepository,
    documents: mockDocumentRepository,
    reminders: mockReminderRepository,
  };
}
