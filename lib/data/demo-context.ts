import { DEMO_HOUSEHOLD_ID, getRepositories } from "@/lib/repositories";

export function getDemoContext() {
  const repos = getRepositories("mock");
  const household = repos.households.getDemoHousehold();
  const user = repos.users.getDemoUser();
  return {
    repos,
    householdId: DEMO_HOUSEHOLD_ID,
    household,
    user,
  };
}

export function getEntitySnapshot() {
  const { repos, householdId } = getDemoContext();
  return {
    homeItems: repos.homeItems.list(householdId),
    contracts: repos.contracts.list(householdId),
    documents: repos.documents.list(householdId),
    reminders: repos.reminders.list(householdId),
  };
}
