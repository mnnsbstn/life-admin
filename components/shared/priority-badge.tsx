import { Badge } from "@/components/ui/badge";
import type { ReminderPriority } from "@/lib/domain/enums";
import { cn } from "@/lib/utils";

const styles: Record<ReminderPriority, string> = {
  low: "text-muted-foreground",
  medium: "border-blue-200/80 bg-blue-50 text-blue-900",
  high: "border-red-200/80 bg-red-50 text-red-900",
};

export function PriorityBadge({ priority }: { priority: ReminderPriority }) {
  return (
    <Badge variant="outline" className={cn("font-normal capitalize", styles[priority])}>
      {priority}
    </Badge>
  );
}
