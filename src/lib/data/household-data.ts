import { getDemoSession } from "@/lib/auth/demo-session";
import { getRepositories } from "@/lib/repositories";

export async function getHouseholdContextData() {
  const session = await getDemoSession();
  const repos = getRepositories();

  const [homeItems, contracts, documents, reminders] = await Promise.all([
    repos.homeItems.list({ householdId: session.householdId }),
    repos.contracts.list({ householdId: session.householdId }),
    repos.documents.list({ householdId: session.householdId }),
    repos.reminders.list({ householdId: session.householdId }),
  ]);

  return {
    session,
    homeItems,
    contracts,
    documents,
    reminders,
  };
}
