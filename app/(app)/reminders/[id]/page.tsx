import Link from "next/link";
import { notFound } from "next/navigation";
import { getDemoContext } from "@/lib/data/demo-context";
import { EntityHeader } from "@/components/shared/entity-header";
import { DetailField } from "@/components/shared/detail-field";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { CompleteReminderButton } from "@/components/reminders/complete-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateDE } from "@/lib/utils/format";

type PageProps = { params: Promise<{ id: string }> };

export default async function ReminderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { repos, householdId } = getDemoContext();
  const reminder = repos.reminders.getById(id);
  if (!reminder || reminder.householdId !== householdId) notFound();

  const homeItem = reminder.homeItemId ? repos.homeItems.getById(reminder.homeItemId) : undefined;
  const contract = reminder.contractId ? repos.contracts.getById(reminder.contractId) : undefined;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <EntityHeader
        title={reminder.title}
        editHref={`/reminders/${id}/edit`}
        actions={
          reminder.status !== "completed" ? <CompleteReminderButton id={id} /> : undefined
        }
      />
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <StatusBadge status={reminder.status} />
            <PriorityBadge priority={reminder.priority} />
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Due date" value={formatDateDE(reminder.dueDate)} />
            <DetailField
              label="Home item"
              value={
                homeItem ? (
                  <Link href={`/home/${homeItem.id}`} className="underline-offset-4 hover:underline">
                    {homeItem.name}
                  </Link>
                ) : (
                  "—"
                )
              }
            />
            <DetailField
              label="Contract"
              value={
                contract ? (
                  <Link href={`/contracts/${contract.id}`} className="underline-offset-4 hover:underline">
                    {contract.name}
                  </Link>
                ) : (
                  "—"
                )
              }
            />
          </dl>
          {reminder.notes ? <p className="text-sm text-muted-foreground">{reminder.notes}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
