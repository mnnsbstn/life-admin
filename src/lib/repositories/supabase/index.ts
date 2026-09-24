import { mockContractRepository } from "@/lib/repositories/mock/contract.repository";
import { mockDocumentRepository } from "@/lib/repositories/mock/document.repository";
import { mockReminderRepository } from "@/lib/repositories/mock/reminder.repository";
import { supabaseHomeItemRepository } from "@/lib/repositories/supabase/home-item.repository";
import { supabaseHouseholdRepository } from "@/lib/repositories/supabase/household.repository";
import { supabaseUserRepository } from "@/lib/repositories/supabase/user.repository";
import type { Repositories } from "@/lib/repositories/types";

/** Supabase for identity + home items; other modules remain mock until V0.2+. */
export function createSupabaseRepositories(): Repositories {
  return {
    users: supabaseUserRepository,
    households: supabaseHouseholdRepository,
    homeItems: supabaseHomeItemRepository,
    contracts: mockContractRepository,
    documents: mockDocumentRepository,
    reminders: mockReminderRepository,
  };
}
