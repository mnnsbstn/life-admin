import type { Metadata } from "next";

import { DocumentForm } from "@/features/documents/components/document-form";
import { emptyDocumentFormValues } from "@/features/documents/lib/map-form";
import { getHouseholdContextData } from "@/lib/data/household-data";

export const metadata: Metadata = {
  title: "Dokument anlegen",
};

export default async function NewDocumentPage() {
  const { homeItems, contracts } = await getHouseholdContextData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dokument anlegen</h1>
      <DocumentForm
        defaultValues={emptyDocumentFormValues}
        homeItems={homeItems}
        contracts={contracts}
      />
    </div>
  );
}
