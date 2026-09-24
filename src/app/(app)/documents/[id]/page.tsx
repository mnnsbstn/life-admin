import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ModulePlaceholder } from "@/components/shell/module-placeholder";
import { getRepositories } from "@/lib/repositories";

interface DocumentDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: DocumentDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const document = await getRepositories().documents.getById(id);
  return { title: document?.title ?? "Document" };
}

export default async function DocumentDetailPage({
  params,
}: DocumentDetailPageProps) {
  const { id } = await params;
  const document = await getRepositories().documents.getById(id);
  if (!document) notFound();

  return (
    <ModulePlaceholder
      title={document.title}
      description="Detailansicht wird in Step 7 implementiert."
    />
  );
}
