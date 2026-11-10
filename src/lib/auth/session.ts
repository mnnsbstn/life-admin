import { redirect } from "next/navigation";

import {
  readActiveHouseholdId,
  resolveActiveHousehold,
} from "@/lib/auth/active-household";
import { DEMO_HOUSEHOLD_ID, DEMO_USER_ID } from "@/lib/constants";
import { getRepositories } from "@/lib/repositories";
import type { User } from "@/lib/domain/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { shouldUseSupabaseBackend } from "@/lib/supabase/env";

function loginRedirect(message: string, next = "/today") {
  redirect(
    `/login?error=${encodeURIComponent(message)}&next=${encodeURIComponent(next)}`,
  );
}

async function ensureSupabaseHousehold(userId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const { data: memberships, error: memberError } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", userId)
    .limit(1);

  if (memberError) {
    loginRedirect(
      `Haushalt konnte nicht geladen werden: ${memberError.message}`,
    );
  }

  if (memberships?.length) return;

  const { error: rpcError } = await supabase.rpc("ensure_my_household");
  if (rpcError) {
    loginRedirect(
      "Kein Haushalt für dein Konto. Bitte erneut registrieren oder in Supabase Migration ensure_my_household ausführen.",
    );
  }
}

async function loadCurrentUser(): Promise<User> {
  const repos = getRepositories();
  try {
    return await repos.users.getCurrentUser();
  } catch {
    loginRedirect(
      "Sitzung abgelaufen oder nicht angemeldet. Bitte erneut anmelden.",
    );
  }
  throw new Error("unreachable");
}

export async function getAppSession() {
  const repos = getRepositories();

  const preferredHouseholdId = await readActiveHouseholdId();

  if (!shouldUseSupabaseBackend()) {
    const user = await repos.users.getCurrentUser();
    const households = await repos.households.getForUser(user.id);
    const household = resolveActiveHousehold(
      households,
      preferredHouseholdId,
      DEMO_HOUSEHOLD_ID,
    );

    if (!household) {
      throw new Error("No household found for demo user.");
    }

    const role =
      (await repos.households.getMemberRole(household.id, user.id)) ?? "owner";

    return {
      user,
      household,
      households,
      userId: DEMO_USER_ID,
      householdId: household.id,
      role,
      mode: "mock" as const,
    };
  }

  const user = await loadCurrentUser();
  await ensureSupabaseHousehold(user.id);

  const households = await repos.households.getForUser(user.id);
  const household = resolveActiveHousehold(households, preferredHouseholdId);

  if (!household) {
    loginRedirect(
      "Kein Haushalt gefunden. Bitte erneut anmelden oder Support kontaktieren.",
    );
  }

  const role =
    (await repos.households.getMemberRole(household.id, user.id)) ?? "member";

  return {
    user,
    household,
    households,
    userId: user.id,
    householdId: household.id,
    role,
    mode: "supabase" as const,
  };
}
