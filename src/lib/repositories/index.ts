import { mockContractRepository } from "@/lib/repositories/mock/contract.repository";
import { mockDocumentRepository } from "@/lib/repositories/mock/document.repository";
import { mockHomeItemRepository } from "@/lib/repositories/mock/home-item.repository";
import { mockHouseholdRepository } from "@/lib/repositories/mock/household.repository";
import { mockReminderRepository } from "@/lib/repositories/mock/reminder.repository";
import { mockUserRepository } from "@/lib/repositories/mock/user.repository";
import { createSupabaseRepositories } from "@/lib/repositories/supabase";
import type { Repositories } from "@/lib/repositories/types";
import {
  getConfiguredDataSource,
  getRuntimeDataBackend,
  isSupabaseEnvConfigured,
  shouldUseSupabaseBackend,
} from "@/lib/supabase/env";

let mockRepositories: Repositories | null = null;

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
  if (shouldUseSupabaseBackend()) {
    return createSupabaseRepositories();
  }

  if (getConfiguredDataSource() === "supabase" && !isSupabaseEnvConfigured()) {
    console.warn(
      "[life-admin] NEXT_PUBLIC_DATA_SOURCE=supabase but URL/anon key missing — using mock.",
    );
  }

  if (!mockRepositories) {
    mockRepositories = createMockRepositories();
  }

  return mockRepositories;
}

function moduleBackend(supabase: boolean): "supabase" | "mock" {
  return supabase && shouldUseSupabaseBackend() ? "supabase" : "mock";
}

export function getRepositoryDiagnostics() {
  const supabase = shouldUseSupabaseBackend();

  return {
    configuredSource: getConfiguredDataSource(),
    runtimeBackend: getRuntimeDataBackend(),
    supabaseEnvPresent: isSupabaseEnvConfigured(),
    homeItemsBackend: moduleBackend(supabase),
    contractsBackend: moduleBackend(supabase),
    documentsBackend: "mock" as const,
    remindersBackend: "mock" as const,
  };
}
