import { ModuleStatus } from "@/components/shared/module-status";

export default function NewReminderPage() {
  return (
    <ModuleStatus
      title="Add reminder"
      description="Form coming in Step 8."
      countLabel="Draft"
      count={0}
    />
  );
}
