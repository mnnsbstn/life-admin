import { notFound } from "next/navigation";
import { ReminderForm } from "@/components/reminders/reminder-form";
import { updateReminderAction } from "@/lib/actions/reminders";
import { getDemoContext } from "@/lib/data/demo-context";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditReminderPage({ params }: PageProps) {
  const { id } = await params;
  const { repos, householdId } = getDemoContext();
  const reminder = repos.reminders.getById(id);
  if (!reminder || reminder.householdId !== householdId) notFound();

  return (
    <ReminderForm
      reminder={reminder}
      homeItems={repos.homeItems.list(householdId)}
      contracts={repos.contracts.list(householdId)}
      action={updateReminderAction.bind(null, id)}
      submitLabel="Save changes"
    />
  );
}
