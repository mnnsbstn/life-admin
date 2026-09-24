import type { Metadata } from "next";

import { AddPlaceholder } from "@/components/shell/add-placeholder";

export const metadata: Metadata = {
  title: "Dokument anlegen",
};

export default function NewDocumentPage() {
  return <AddPlaceholder title="Dokument anlegen" backHref="/documents" />;
}
