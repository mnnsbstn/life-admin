import { Badge } from "@/components/ui/badge";
import type { ReminderStatus } from "@/lib/domain/enums";
import { cn } from "@/lib/utils";

const statusStyles: Record<ReminderStatus, string> = {
  upcoming: "bg-secondary text-secondary-foreground",
  due: "bg-amber-100 text-amber-900 border-amber-200/80",
  completed: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: ReminderStatus }) {
  const label =
    status === "due" ? "Due" : status === "completed" ? "Completed" : "Upcoming";
  return (
    <Badge variant="outline" className={cn("font-normal capitalize", statusStyles[status])}>
      {label}
    </Badge>
  );
}
