"use client";

import { ModuleStatus } from "@/components/shared/module-status";
import { useHouseholdData } from "@/hooks/use-household-data";

export default function RemindersPage() {
  const { snapshot } = useHouseholdData();

  return (
    <ModuleStatus
      title="Reminders"
      description="Manual and derived obligations — full module in Step 6."
      countLabel="Reminders"
      count={snapshot?.reminders.length}
    />
  );
}
