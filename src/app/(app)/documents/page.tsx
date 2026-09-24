import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/shell/module-placeholder";
import { getHouseholdContextData } from "@/lib/data/household-data";

export const metadata: Metadata = {
  title: "Dokumente",
};

export default async function DocumentsPage() {
  const { documents } = await getHouseholdContextData();

  return (
    <ModulePlaceholder
      title="Documents"
      description={`${documents.length} Dokumente in Mock-Daten — Modul-UI folgt in Step 6.`}
    />
  );
}
