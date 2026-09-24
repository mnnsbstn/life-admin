"use client";

import { ModuleStatus } from "@/components/shared/module-status";
import { useHouseholdData } from "@/hooks/use-household-data";

export default function DocumentsPage() {
  const { snapshot } = useHouseholdData();

  return (
    <ModuleStatus
      title="Documents"
      description="Files linked to home items and contracts — full module in Step 6."
      countLabel="Documents"
      count={snapshot?.documents.length}
    />
  );
}
