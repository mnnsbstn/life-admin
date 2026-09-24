import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocumentForm } from "@/features/documents/components/document-form";
import { documentToFormValues } from "@/features/documents/lib/map-form";
import { getHouseholdContextData } from "@/lib/data/household-data";
import { getRepositories } from "@/lib/repositories";

interface EditDocumentPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditDocumentPageProps): Promise<Metadata> {
  const { id } = await params;
  const document = await getRepositories().documents.getById(id);
  return { title: document ? `${document.title} bearbeiten` : "Bearbeiten" };
}

export default async function EditDocumentPage({ params }: EditDocumentPageProps) {
  const { id } = await params;
  const document = await getRepositories().documents.getById(id);
  if (!document) notFound();

  const { homeItems, contracts } = await getHouseholdContextData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dokument bearbeiten</h1>
      <DocumentForm
        defaultValues={documentToFormValues(document)}
        documentId={id}
        homeItems={homeItems}
        contracts={contracts}
      />
    </div>
  );
}
