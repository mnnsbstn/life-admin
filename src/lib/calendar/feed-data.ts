import { buildHouseholdCalendarEvents } from "@/lib/calendar/household-feed";
import type { CalendarEventInput } from "@/lib/calendar/types";
import type { Contract, Reminder } from "@/lib/domain/types";
import {
  mapContractRow,
  type ContractRow,
} from "@/lib/repositories/supabase/mappers/contract";
import {
  mapReminderRow,
  type ReminderRow,
} from "@/lib/repositories/supabase/mappers/reminder";
import { getRepositories } from "@/lib/repositories";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { shouldUseSupabaseBackend } from "@/lib/supabase/env";

export async function loadHouseholdCalendarFeed(
  householdId: string,
): Promise<{ events: CalendarEventInput[]; householdName: string } | null> {
  if (shouldUseSupabaseBackend()) {
    const admin = createSupabaseAdminClient();
    if (!admin) return null;

    const [remindersRes, contractsRes, householdRes] = await Promise.all([
      admin.from("reminders").select("*").eq("household_id", householdId),
      admin.from("contracts").select("*").eq("household_id", householdId),
      admin.from("households").select("name").eq("id", householdId).maybeSingle(),
    ]);

    if (remindersRes.error || contractsRes.error) return null;

    const reminders = (remindersRes.data as ReminderRow[]).map(mapReminderRow);
    const contracts = (contractsRes.data as ContractRow[]).map(mapContractRow);
    const householdName =
      (householdRes.data?.name as string | undefined) ?? "Life Admin";

    return {
      events: buildHouseholdCalendarEvents(reminders, contracts),
      householdName,
    };
  }

  const repos = getRepositories();
  const [reminders, contracts, household] = await Promise.all([
    repos.reminders.list({ householdId }),
    repos.contracts.list({ householdId }),
    repos.households.getById(householdId),
  ]);

  return {
    events: buildHouseholdCalendarEvents(
      reminders as Reminder[],
      contracts as Contract[],
    ),
    householdName: household?.name ?? "Life Admin",
  };
}
