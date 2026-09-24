import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocumentDetailView } from "@/features/documents/components/document-detail-view";
import { resolveDocumentLink } from "@/lib/data/resolve-links";
import { getHouseholdContextData } from "@/lib/data/household-data";
import { getRepositories } from "@/lib/repositories";

interface DocumentDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: DocumentDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const document = await getRepositories().documents.getById(id);
  return { title: document?.title ?? "Dokument" };
}

export default async function DocumentDetailPage({
  params,
}: DocumentDetailPageProps) {
  const { id } = await params;
  const document = await getRepositories().documents.getById(id);
  if (!document) notFound();

  const { homeItems, contracts } = await getHouseholdContextData();
  const link = resolveDocumentLink(document.link, homeItems, contracts);

  const downloadHref = document.storagePath
    ? `/documents/${document.id}/download`
    : undefined;

  return (
    <DocumentDetailView
      document={document}
      link={link}
      downloadHref={downloadHref}
    />
  );
}
