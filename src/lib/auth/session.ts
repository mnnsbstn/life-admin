import { DEMO_HOUSEHOLD_ID, DEMO_USER_ID } from "@/lib/constants";
import { getRepositories } from "@/lib/repositories";
import { shouldUseSupabaseBackend } from "@/lib/supabase/env";

export async function getAppSession() {
  const repos = getRepositories();

  if (!shouldUseSupabaseBackend()) {
    const user = await repos.users.getCurrentUser();
    const households = await repos.households.getForUser(user.id);
    const household =
      households.find((h) => h.id === DEMO_HOUSEHOLD_ID) ?? households[0];

    if (!household) {
      throw new Error("No household found for demo user.");
    }

    const role =
      (await repos.households.getMemberRole(household.id, user.id)) ?? "owner";

    return {
      user,
      household,
      userId: DEMO_USER_ID,
      householdId: household.id,
      role,
      mode: "mock" as const,
    };
  }

  const user = await repos.users.getCurrentUser();
  const households = await repos.households.getForUser(user.id);
  const household = households[0];

  if (!household) {
    throw new Error(
      "Kein Haushalt gefunden. Bitte erneut registrieren oder Support kontaktieren.",
    );
  }

  const role =
    (await repos.households.getMemberRole(household.id, user.id)) ?? "member";

  return {
    user,
    household,
    userId: user.id,
    householdId: household.id,
    role,
    mode: "supabase" as const,
  };
}
