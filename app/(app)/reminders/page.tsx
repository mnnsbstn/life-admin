import Link from "next/link";
import { getDemoContext } from "@/lib/data/demo-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/shared/link-button";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { formatDateDE } from "@/lib/utils/format";
import { Plus } from "lucide-react";

export default function RemindersListPage() {
  const { repos, householdId } = getDemoContext();
  const reminders = repos.reminders.list(householdId);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{reminders.length} reminders</p>
        <LinkButton href="/reminders/new" size="sm">
          <Plus className="mr-2 size-4" aria-hidden />
          Add reminder
        </LinkButton>
      </div>
      {reminders.length === 0 ? (
        <EmptyState
          title="No reminders"
          description="Due dates for maintenance, renewals, and tasks."
          action={
            <LinkButton href="/reminders/new">Add reminder</LinkButton>
          }
        />
      ) : (
        <ul className="grid gap-3">
          {reminders.map((rem) => (
            <li key={rem.id}>
              <Link href={`/reminders/${rem.id}`}>
                <Card className="border-border/60 shadow-sm transition-colors hover:bg-muted/20">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                    <div>
                      <CardTitle className="text-base font-medium">{rem.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">Due {formatDateDE(rem.dueDate)}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <StatusBadge status={rem.status} />
                      <PriorityBadge priority={rem.priority} />
                    </div>
                  </CardHeader>
                  {rem.notes ? (
                    <CardContent className="text-sm text-muted-foreground line-clamp-2">{rem.notes}</CardContent>
                  ) : null}
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
