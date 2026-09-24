import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/shell/module-placeholder";
import { getHouseholdContextData } from "@/lib/data/household-data";

export const metadata: Metadata = {
  title: "Reminders",
};

export default async function RemindersPage() {
  const { reminders } = await getHouseholdContextData();

  return (
    <ModulePlaceholder
      title="Reminders"
      description={`${reminders.length} Reminder in Mock-Daten — Modul-UI folgt in Step 6.`}
    />
  );
}
