import type { Metadata } from "next";

import { ReminderListView } from "@/features/reminders/components/reminder-list-view";
import { getHouseholdContextData } from "@/lib/data/household-data";
import { sortReminders } from "@/lib/domain/list-sort";
import { isStaticExportBuild } from "@/lib/deployment-mode";

export const metadata: Metadata = {
  title: "Erinnerungen",
};

interface RemindersPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function RemindersPage({ searchParams }: RemindersPageProps) {
  const status = isStaticExportBuild()
    ? undefined
    : (await searchParams).status;
  const { reminders, homeItems, contracts } = await getHouseholdContextData();

  const statusFilter =
    status === "due" || status === "upcoming" || status === "completed"
      ? status
      : "all";

  return (
    <ReminderListView
      items={sortReminders(reminders)}
      homeItems={homeItems}
      contracts={contracts}
      statusFilter={statusFilter}
    />
  );
}
