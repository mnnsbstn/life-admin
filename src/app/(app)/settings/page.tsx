import type { Metadata } from "next";
import { headers } from "next/headers";

import { SettingsView } from "@/features/settings/components/settings-view";
import { getAppSession } from "@/lib/auth/session";
import { getRepositories } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "Einstellungen",
};

function resolveAppOrigin(headerStore: Headers): string {
  const host =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export default async function SettingsPage() {
  const session = await getAppSession();
  const repos = getRepositories();
  const [members, invitations] = await Promise.all([
    repos.households.listMembers(session.householdId),
    session.role === "owner"
      ? repos.households.listInvitations(session.householdId)
      : Promise.resolve([]),
  ]);

  const appOrigin = resolveAppOrigin(await headers());

  return (
    <SettingsView
      householdName={session.household.name}
      members={members}
      invitations={invitations}
      memberRole={session.role}
      appOrigin={appOrigin}
    />
  );
}
