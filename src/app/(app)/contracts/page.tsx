"use client";

import { ModuleStatus } from "@/components/shared/module-status";
import { useHouseholdData } from "@/hooks/use-household-data";

export default function ContractsPage() {
  const { snapshot } = useHouseholdData();

  return (
    <ModuleStatus
      title="Contracts"
      description="Utilities, insurance, and subscriptions — full module in Step 6."
      countLabel="Contracts"
      count={snapshot?.contracts.length}
    />
  );
}
