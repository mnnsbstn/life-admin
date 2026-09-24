import type { Metadata } from "next";

import { DocumentForm } from "@/features/documents/components/document-form";
import { emptyDocumentFormValues } from "@/features/documents/lib/map-form";
import { getHouseholdContextData } from "@/lib/data/household-data";
import { ReadOnlyDemoNotice } from "@/components/domain/read-only-demo-notice";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";

export const metadata: Metadata = {
  title: "Dokument anlegen",
};

export default async function NewDocumentPage() {
  if (isGitHubPagesPreview()) {
    return <ReadOnlyDemoNotice backHref="/documents" />;
  }

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
