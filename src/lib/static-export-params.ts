import { SEED_IDS } from "@/lib/repositories/mock/ids";

export function staticHomeItemParams() {
  return Object.values(SEED_IDS.homeItems).map((id) => ({ id }));
}

export function staticContractParams() {
  return Object.values(SEED_IDS.contracts).map((id) => ({ id }));
}

export function staticDocumentParams() {
  return Object.values(SEED_IDS.documents).map((id) => ({ id }));
}

export function staticReminderParams() {
  return Object.values(SEED_IDS.reminders).map((id) => ({ id }));
}

export function staticVehicleParams() {
  return Object.values(SEED_IDS.vehicles).map((id) => ({ id }));
}

export function staticFinancialAccountParams() {
  return Object.values(SEED_IDS.financialAccounts).map((id) => ({ id }));
}

export function staticFamilyMemberParams() {
  return Object.values(SEED_IDS.familyMembers).map((id) => ({ id }));
}

/** Demo invite token pre-rendered for GitHub Pages static export. */
export const STATIC_INVITE_DEMO_TOKEN = "github-pages-demo";

export function staticInviteParams() {
  return [{ token: STATIC_INVITE_DEMO_TOKEN }];
}
