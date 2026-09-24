import { notFound } from "next/navigation";
import { getDemoContext } from "@/lib/data/demo-context";
import { EntityHeader } from "@/components/shared/entity-header";
import { DetailField } from "@/components/shared/detail-field";
import { LinkedDocuments } from "@/components/shared/linked-documents";
import { LinkedReminders } from "@/components/shared/linked-reminders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateDE, labelFromEnum } from "@/lib/utils/format";

type PageProps = { params: Promise<{ id: string }> };

export default async function HomeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { repos, householdId } = getDemoContext();
  const item = repos.homeItems.getById(id);
  if (!item || item.householdId !== householdId) notFound();

  const documents = repos.documents.list(householdId).filter((d) => d.homeItemId === id);
  const reminders = repos.reminders.list(householdId).filter((r) => r.homeItemId === id);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <EntityHeader
        title={item.name}
        subtitle={[item.manufacturer, item.model].filter(Boolean).join(" · ")}
        editHref={`/home/${id}/edit`}
      />
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailField label="Category" value={labelFromEnum(item.category)} />
            <DetailField label="Location" value={item.location} />
            <DetailField label="Serial number" value={item.serialNumber} />
            <DetailField label="Purchase date" value={formatDateDE(item.purchaseDate)} />
            <DetailField label="Installation" value={formatDateDE(item.installationDate)} />
            <DetailField
              label="Purchase price"
              value={formatCurrency(item.purchasePrice, item.currency ?? "EUR")}
            />
            <DetailField label="Warranty ends" value={formatDateDE(item.warrantyEndsAt)} />
            <DetailField label="Last maintenance" value={formatDateDE(item.lastMaintenanceAt)} />
            <DetailField label="Next maintenance" value={formatDateDE(item.nextMaintenanceAt)} />
          </dl>
          {item.notes ? (
            <p className="mt-4 text-sm text-muted-foreground whitespace-pre-wrap">{item.notes}</p>
          ) : null}
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <LinkedDocuments documents={documents} />
        <LinkedReminders reminders={reminders} />
      </div>
    </div>
  );
}
