import { Badge } from "@/components/ui/badge";
import type { ReminderStatus } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

const labels: Record<ReminderStatus, string> = {
  upcoming: "Geplant",
  due: "Fällig",
  completed: "Erledigt",
};

const styles: Record<ReminderStatus, string> = {
  upcoming: "border-border bg-muted/40 text-muted-foreground",
  due: "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100",
  completed: "border-border bg-muted/20 text-muted-foreground",
};

interface ReminderStatusBadgeProps {
  status: ReminderStatus;
}

export function ReminderStatusBadge({ status }: ReminderStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn("font-normal", styles[status])}>
      {labels[status]}
    </Badge>
  );
}
