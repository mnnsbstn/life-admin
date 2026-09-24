import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/shell/module-placeholder";
import { getHouseholdContextData } from "@/lib/data/household-data";

export const metadata: Metadata = {
  title: "Contracts",
};

export default async function ContractsPage() {
  const { contracts } = await getHouseholdContextData();

  return (
    <ModulePlaceholder
      title="Contracts"
      description={`${contracts.length} Verträge in Mock-Daten — Modul-UI folgt in Step 6.`}
    />
  );
}
