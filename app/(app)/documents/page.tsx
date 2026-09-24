import Link from "next/link";
import { getDemoContext } from "@/lib/data/demo-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/shared/link-button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateDE, labelFromEnum } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus } from "lucide-react";

export default function DocumentsListPage() {
  const { repos, householdId } = getDemoContext();
  const documents = repos.documents.list(householdId);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{documents.length} documents</p>
        <LinkButton href="/documents/new" size="sm">
          <Plus className="mr-2 size-4" aria-hidden />
          Add document
        </LinkButton>
      </div>
      {documents.length === 0 ? (
        <EmptyState
          title="No documents"
          description="Store metadata for invoices, manuals, and contracts."
          action={
            <LinkButton href="/documents/new">Add document</LinkButton>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {documents.map((doc) => (
            <li key={doc.id}>
              <Link href={`/documents/${doc.id}`}>
                <Card className="h-full border-border/60 shadow-sm transition-colors hover:bg-muted/20">
                  <CardHeader className="flex flex-row items-start gap-3 pb-2">
                    <FileText className="mt-0.5 size-4 text-muted-foreground" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base font-medium">{doc.title}</CardTitle>
                      <Badge variant="secondary" className="mt-2 font-normal capitalize">
                        {labelFromEnum(doc.type)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    {doc.fileName ?? "No file attached"}
                    {doc.issuedAt ? ` · ${formatDateDE(doc.issuedAt)}` : ""}
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
