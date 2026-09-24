import { mockContractRepository } from "@/lib/repositories/mock/contract.repository";
import { mockDocumentRepository } from "@/lib/repositories/mock/document.repository";
import { mockHomeItemRepository } from "@/lib/repositories/mock/home-item.repository";
import { mockHouseholdRepository } from "@/lib/repositories/mock/household.repository";
import { mockReminderRepository } from "@/lib/repositories/mock/reminder.repository";
import { mockUserRepository } from "@/lib/repositories/mock/user.repository";
import type { Repositories } from "@/lib/repositories/types";

let repositories: Repositories | null = null;

export function getRepositories(): Repositories {
  const source = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";

  if (source !== "mock") {
    // Supabase implementation will plug in here (V0.2+)
    console.warn(
      `[life-admin] DATA_SOURCE "${source}" not implemented; falling back to mock.`,
    );
  }

  if (!repositories) {
    repositories = {
      users: mockUserRepository,
      households: mockHouseholdRepository,
      homeItems: mockHomeItemRepository,
      contracts: mockContractRepository,
      documents: mockDocumentRepository,
      reminders: mockReminderRepository,
    };
  }

  return repositories;
}
