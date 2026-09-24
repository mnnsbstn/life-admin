import { ReminderForm } from "@/components/reminders/reminder-form";
import { createReminderAction } from "@/lib/actions/reminders";
import { getDemoContext } from "@/lib/data/demo-context";

export default function NewReminderPage() {
  const { repos, householdId } = getDemoContext();
  return (
    <div className="space-y-6">
      <ReminderForm
        homeItems={repos.homeItems.list(householdId)}
        contracts={repos.contracts.list(householdId)}
        action={createReminderAction}
        submitLabel="Create reminder"
      />
    </div>
  );
}
