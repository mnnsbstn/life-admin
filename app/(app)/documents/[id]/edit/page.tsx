import { notFound } from "next/navigation";
import { DocumentForm } from "@/components/documents/document-form";
import { updateDocumentAction } from "@/lib/actions/documents";
import { getDemoContext } from "@/lib/data/demo-context";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditDocumentPage({ params }: PageProps) {
  const { id } = await params;
  const { repos, householdId } = getDemoContext();
  const doc = repos.documents.getById(id);
  if (!doc || doc.householdId !== householdId) notFound();

  return (
    <div className="space-y-6">
      <DocumentForm
        document={doc}
        homeItems={repos.homeItems.list(householdId)}
        contracts={repos.contracts.list(householdId)}
        action={updateDocumentAction.bind(null, id)}
        submitLabel="Save changes"
      />
    </div>
  );
}
