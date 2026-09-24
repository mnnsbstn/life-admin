import { Badge } from "@/components/ui/badge";
import type { ReminderPriority } from "@/lib/domain/types";

const labels: Record<ReminderPriority, string> = {
  low: "Niedrig",
  medium: "Mittel",
  high: "Hoch",
};

interface PriorityBadgeProps {
  priority: ReminderPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Badge variant="secondary" className="font-normal">
      {labels[priority]}
    </Badge>
  );
}
