import type { Metadata } from "next";

import { DocumentListView } from "@/features/documents/components/document-list-view";
import { getHouseholdContextData } from "@/lib/data/household-data";

export const metadata: Metadata = {
  title: "Dokumente",
};

export default async function DocumentsPage() {
  const { documents, homeItems, contracts } = await getHouseholdContextData();

  return (
    <DocumentListView
      items={documents}
      homeItems={homeItems}
      contracts={contracts}
    />
  );
}
