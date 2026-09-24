import { mockContractRepository } from "@/lib/repositories/mock/contract.repository";
import { mockDocumentRepository } from "@/lib/repositories/mock/document.repository";
import { mockHomeItemRepository } from "@/lib/repositories/mock/home-item.repository";
import { mockHouseholdRepository } from "@/lib/repositories/mock/household.repository";
import { mockReminderRepository } from "@/lib/repositories/mock/reminder.repository";
import { mockUserRepository } from "@/lib/repositories/mock/user.repository";
import type { Repositories } from "@/lib/repositories/types";
import {
  getConfiguredDataSource,
  getRuntimeDataBackend,
  isSupabaseEnvConfigured,
} from "@/lib/supabase/env";

let repositories: Repositories | null = null;

function createMockRepositories(): Repositories {
  return {
    users: mockUserRepository,
    households: mockHouseholdRepository,
    homeItems: mockHomeItemRepository,
    contracts: mockContractRepository,
    documents: mockDocumentRepository,
    reminders: mockReminderRepository,
  };
}

export function getRepositories(): Repositories {
  const source = getConfiguredDataSource();

  if (source === "supabase") {
    if (!isSupabaseEnvConfigured()) {
      console.warn(
        "[life-admin] NEXT_PUBLIC_DATA_SOURCE=supabase but URL/anon key missing — using mock.",
      );
    } else {
      console.warn(
        "[life-admin] Supabase repositories not wired yet (Auth + adapters) — using mock.",
      );
    }
  }

  if (!repositories) {
    repositories = createMockRepositories();
  }

  return repositories;
}

export function getRepositoryDiagnostics() {
  return {
    configuredSource: getConfiguredDataSource(),
    runtimeBackend: getRuntimeDataBackend(),
    supabaseEnvPresent: isSupabaseEnvConfigured(),
  };
}
