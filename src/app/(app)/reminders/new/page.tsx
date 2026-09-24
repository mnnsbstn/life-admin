import type { Metadata } from "next";

import { ReminderForm } from "@/features/reminders/components/reminder-form";
import { emptyReminderFormValues } from "@/features/reminders/lib/map-form";
import { getHouseholdContextData } from "@/lib/data/household-data";
import { ReadOnlyDemoNotice } from "@/components/domain/read-only-demo-notice";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";

export const metadata: Metadata = {
  title: "Erinnerung anlegen",
};

export default async function NewReminderPage() {
  if (isGitHubPagesPreview()) {
    return <ReadOnlyDemoNotice backHref="/reminders" />;
  }

  const { homeItems, contracts } = await getHouseholdContextData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Erinnerung anlegen</h1>
      <ReminderForm
        defaultValues={emptyReminderFormValues}
        homeItems={homeItems}
        contracts={contracts}
      />
    </div>
  );
}
