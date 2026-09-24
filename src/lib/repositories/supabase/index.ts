import { supabaseContractRepository } from "@/lib/repositories/supabase/contract.repository";
import { supabaseDocumentRepository } from "@/lib/repositories/supabase/document.repository";
import { supabaseHomeItemRepository } from "@/lib/repositories/supabase/home-item.repository";
import { supabaseHouseholdRepository } from "@/lib/repositories/supabase/household.repository";
import { supabaseReminderRepository } from "@/lib/repositories/supabase/reminder.repository";
import { supabaseUserRepository } from "@/lib/repositories/supabase/user.repository";
import type { Repositories } from "@/lib/repositories/types";

export function createSupabaseRepositories(): Repositories {
  return {
    users: supabaseUserRepository,
    households: supabaseHouseholdRepository,
    homeItems: supabaseHomeItemRepository,
    contracts: supabaseContractRepository,
    documents: supabaseDocumentRepository,
    reminders: supabaseReminderRepository,
  };
}
