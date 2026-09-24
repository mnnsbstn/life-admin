"use client";

import { ModuleStatus } from "@/components/shared/module-status";
import { useHouseholdData } from "@/hooks/use-household-data";

export default function HomePage() {
  const { snapshot } = useHouseholdData();

  return (
    <ModuleStatus
      title="Home"
      description="Household assets and systems — full module in Step 6."
      countLabel="Home items"
      count={snapshot?.homeItems.length}
    />
  );
}
