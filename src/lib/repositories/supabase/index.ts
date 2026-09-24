import { mockDocumentRepository } from "@/lib/repositories/mock/document.repository";
import { mockReminderRepository } from "@/lib/repositories/mock/reminder.repository";
import { supabaseContractRepository } from "@/lib/repositories/supabase/contract.repository";
import { supabaseHomeItemRepository } from "@/lib/repositories/supabase/home-item.repository";
import { supabaseHouseholdRepository } from "@/lib/repositories/supabase/household.repository";
import { supabaseUserRepository } from "@/lib/repositories/supabase/user.repository";
import type { Repositories } from "@/lib/repositories/types";

/** Supabase: identity, home, contracts. Documents + reminders still mock. */
export function createSupabaseRepositories(): Repositories {
  return {
    users: supabaseUserRepository,
    households: supabaseHouseholdRepository,
    homeItems: supabaseHomeItemRepository,
    contracts: supabaseContractRepository,
    documents: mockDocumentRepository,
    reminders: mockReminderRepository,
  };
}
