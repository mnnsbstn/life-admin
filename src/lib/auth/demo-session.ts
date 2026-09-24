import { DEMO_HOUSEHOLD_ID, DEMO_USER_ID } from "@/lib/constants";
import { getRepositories } from "@/lib/repositories";

export async function getDemoSession() {
  const repos = getRepositories();
  const user = await repos.users.getCurrentUser();
  const households = await repos.households.getForUser(user.id);
  const household =
    households.find((h) => h.id === DEMO_HOUSEHOLD_ID) ?? households[0];

  if (!household) {
    throw new Error("No household found for demo user.");
  }

  return {
    user,
    household,
    userId: DEMO_USER_ID,
    householdId: household.id,
  };
}
