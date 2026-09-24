import { DocumentForm } from "@/components/documents/document-form";
import { createDocumentAction } from "@/lib/actions/documents";
import { getDemoContext } from "@/lib/data/demo-context";

export default function NewDocumentPage() {
  const { repos, householdId } = getDemoContext();
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Add document metadata (no upload in V0.1).</p>
      <DocumentForm
        homeItems={repos.homeItems.list(householdId)}
        contracts={repos.contracts.list(householdId)}
        action={createDocumentAction}
        submitLabel="Create document"
      />
    </div>
  );
}
