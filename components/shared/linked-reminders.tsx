import Link from "next/link";
import type { Reminder } from "@/lib/domain/types/reminder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateDE } from "@/lib/utils/format";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";

export function LinkedReminders({ reminders }: { reminders: Reminder[] }) {
  if (reminders.length === 0) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Reminders</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">No linked reminders.</CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {reminders.map((rem) => (
          <Link
            key={rem.id}
            href={`/reminders/${rem.id}`}
            className="flex flex-col gap-2 rounded-md border border-border/50 px-3 py-2 text-sm transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{rem.title}</p>
              <p className="text-xs text-muted-foreground">Due {formatDateDE(rem.dueDate)}</p>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={rem.status} />
              <PriorityBadge priority={rem.priority} />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
