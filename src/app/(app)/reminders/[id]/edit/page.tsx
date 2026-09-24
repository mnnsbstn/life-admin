import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ReminderForm } from "@/features/reminders/components/reminder-form";
import { reminderToFormValues } from "@/features/reminders/lib/map-form";
import { getHouseholdContextData } from "@/lib/data/household-data";
import { getRepositories } from "@/lib/repositories";
import { staticReminderParams } from "@/lib/static-export-params";
import { staticIdParams } from "@/lib/static-generate-params";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";
import { ReadOnlyDemoNotice } from "@/components/domain/read-only-demo-notice";

export function generateStaticParams() {
  return staticIdParams(staticReminderParams());
}

interface EditReminderPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditReminderPageProps): Promise<Metadata> {
  const { id } = await params;
  const reminder = await getRepositories().reminders.getById(id);
  return { title: reminder ? `${reminder.title} bearbeiten` : "Bearbeiten" };
}

export default async function EditReminderPage({ params }: EditReminderPageProps) {
  if (isGitHubPagesPreview()) {
    return <ReadOnlyDemoNotice backHref="/reminders" />;
  }

  const { id } = await params;
  const reminder = await getRepositories().reminders.getById(id);
  if (!reminder) notFound();

  const { homeItems, contracts } = await getHouseholdContextData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Erinnerung bearbeiten</h1>
      <ReminderForm
        defaultValues={reminderToFormValues(reminder)}
        reminderId={id}
        homeItems={homeItems}
        contracts={contracts}
      />
    </div>
  );
}
