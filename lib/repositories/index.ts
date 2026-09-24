import type { DataSource, Repositories } from "./types";
import { mockHomeItemRepository } from "./mock/home-item-repository";
import { mockContractRepository } from "./mock/contract-repository";
import { mockDocumentRepository } from "./mock/document-repository";
import { mockReminderRepository } from "./mock/reminder-repository";
import { mockUserRepository } from "./mock/user-repository";
import { mockHouseholdRepository } from "./mock/household-repository";

export function getRepositories(source: DataSource = "mock"): Repositories {
  if (source === "supabase") {
    throw new Error("Supabase repositories are not implemented in V0.1");
  }
  return {
    homeItems: mockHomeItemRepository,
    contracts: mockContractRepository,
    documents: mockDocumentRepository,
    reminders: mockReminderRepository,
    users: mockUserRepository,
    households: mockHouseholdRepository,
  };
}

export type { Repositories, DataSource } from "./types";
export { DEMO_HOUSEHOLD_ID, DEMO_USER_ID } from "./mock/store";
