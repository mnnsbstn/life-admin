import type { Metadata } from "next";

import Link from "next/link";

import { DocumentFormNewClient } from "@/features/documents/components/document-form-new-client";
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
      <p className="text-sm text-muted-foreground">
        Tipp:{" "}
        <Link href="/capture" className="underline underline-offset-2">
          Smart Capture
        </Link>{" "}
        zum Vorausfüllen aus Text.
      </p>
      <DocumentFormNewClient
        defaultValues={emptyDocumentFormValues}
        homeItems={homeItems}
        contracts={contracts}
      />
    </div>
  );
}
