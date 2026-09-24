import { notFound } from "next/navigation";
import { getDemoContext } from "@/lib/data/demo-context";
import { EntityHeader } from "@/components/shared/entity-header";
import { DetailField } from "@/components/shared/detail-field";
import { LinkedDocuments } from "@/components/shared/linked-documents";
import { LinkedReminders } from "@/components/shared/linked-reminders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cancellationDateIso } from "@/lib/services/dates";
import { formatCurrency, formatDateDE, labelFromEnum } from "@/lib/utils/format";

type PageProps = { params: Promise<{ id: string }> };

export default async function ContractDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { repos, householdId } = getDemoContext();
  const contract = repos.contracts.getById(id);
  if (!contract || contract.householdId !== householdId) notFound();

  const documents = repos.documents.list(householdId).filter((d) => d.contractId === id);
  const reminders = repos.reminders.list(householdId).filter((r) => r.contractId === id);
  const cancelBy = cancellationDateIso(contract);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <EntityHeader title={contract.name} subtitle={contract.provider} editHref={`/contracts/${id}/edit`} />
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailField label="Category" value={labelFromEnum(contract.category)} />
            <DetailField
              label="Cost"
              value={
                contract.cost != null
                  ? `${formatCurrency(contract.cost)} / ${contract.costInterval ? labelFromEnum(contract.costInterval).toLowerCase() : "—"}`
                  : "—"
              }
            />
            <DetailField label="Start date" value={formatDateDE(contract.startDate)} />
            <DetailField label="Minimum term" value={contract.minimumTermMonths ? `${contract.minimumTermMonths} months` : "—"} />
            <DetailField label="Notice period" value={contract.noticePeriodDays ? `${contract.noticePeriodDays} days` : "—"} />
            <DetailField label="Auto-renewal" value={contract.autoRenewal ? "Yes" : "No"} />
            <DetailField label="Cancel by (est.)" value={formatDateDE(cancelBy)} />
          </dl>
          {contract.notes ? (
            <p className="mt-4 text-sm text-muted-foreground whitespace-pre-wrap">{contract.notes}</p>
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
