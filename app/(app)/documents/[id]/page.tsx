import Link from "next/link";
import { notFound } from "next/navigation";
import { getDemoContext } from "@/lib/data/demo-context";
import { EntityHeader } from "@/components/shared/entity-header";
import { DetailField } from "@/components/shared/detail-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateDE, labelFromEnum } from "@/lib/utils/format";
import { ExternalLink } from "lucide-react";

type PageProps = { params: Promise<{ id: string }> };

export default async function DocumentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { repos, householdId } = getDemoContext();
  const doc = repos.documents.getById(id);
  if (!doc || doc.householdId !== householdId) notFound();

  const homeItem = doc.homeItemId ? repos.homeItems.getById(doc.homeItemId) : undefined;
  const contract = doc.contractId ? repos.contracts.getById(doc.contractId) : undefined;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <EntityHeader title={doc.title} subtitle={labelFromEnum(doc.type)} editHref={`/documents/${id}/edit`} />
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Issued" value={formatDateDE(doc.issuedAt)} />
            <DetailField label="File" value={doc.fileName} />
            <DetailField label="MIME type" value={doc.mimeType} />
            <DetailField
              label="Size"
              value={doc.sizeBytes ? `${Math.round(doc.sizeBytes / 1024)} KB` : "—"}
            />
            <DetailField
              label="Linked home item"
              value={
                homeItem ? (
                  <Link href={`/home/${homeItem.id}`} className="text-primary underline-offset-4 hover:underline">
                    {homeItem.name}
                  </Link>
                ) : (
                  "—"
                )
              }
            />
            <DetailField
              label="Linked contract"
              value={
                contract ? (
                  <Link href={`/contracts/${contract.id}`} className="text-primary underline-offset-4 hover:underline">
                    {contract.name}
                  </Link>
                ) : (
                  "—"
                )
              }
            />
          </dl>
          {doc.notes ? <p className="text-sm text-muted-foreground">{doc.notes}</p> : null}
          <Button variant="outline" size="sm" disabled className="gap-2">
            <ExternalLink className="size-4" aria-hidden />
            Open file (mock)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
