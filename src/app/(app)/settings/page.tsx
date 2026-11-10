import type { Metadata } from "next";
import { headers } from "next/headers";

import { SettingsView } from "@/features/settings/components/settings-view";
import { resolveAppOrigin } from "@/lib/app-origin";
import { getAppSession } from "@/lib/auth/session";
import { getRepositories } from "@/lib/repositories";
import {
  githubPagesAppOrigin,
  isStaticExportBuild,
} from "@/lib/deployment-mode";
import { isInvitationEmailConfigured } from "@/lib/email/invitation-mailer";
import { isSmartCaptureLlmConfigured } from "@/lib/smart-capture/llm";
import { buildHouseholdCalendarEvents } from "@/lib/calendar/household-feed";

export const metadata: Metadata = {
  title: "Einstellungen",
};

export default async function SettingsPage() {
  const session = await getAppSession();
  const repos = getRepositories();
  const [members, invitations, reminders, contracts] = await Promise.all([
    repos.households.listMembers(session.householdId),
    session.role === "owner"
      ? repos.households.listInvitations(session.householdId)
      : Promise.resolve([]),
    repos.reminders.list({ householdId: session.householdId }),
    repos.contracts.list({ householdId: session.householdId }),
  ]);

  const calendarEvents = buildHouseholdCalendarEvents(reminders, contracts);

  const appOrigin = isStaticExportBuild()
    ? githubPagesAppOrigin()
    : resolveAppOrigin(await headers());

  return (
    <SettingsView
      households={session.households}
      activeHouseholdId={session.householdId}
      householdName={session.household.name}
      members={members}
      invitations={invitations}
      memberRole={session.role}
      appOrigin={appOrigin}
      invitationEmailEnabled={isInvitationEmailConfigured()}
      smartCaptureLlmEnabled={isSmartCaptureLlmConfigured()}
      calendarEvents={calendarEvents}
    />
  );
}
