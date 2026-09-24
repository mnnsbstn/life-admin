import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  formatUrgencyLabel,
  getUrgencyTone,
  type UrgencyTone,
} from "@/lib/format/urgency";

const toneClass: Record<UrgencyTone, string> = {
  overdue:
    "border-destructive/20 bg-destructive/5 text-destructive dark:bg-destructive/10",
  today: "border-amber-500/25 bg-amber-500/8 text-amber-950 dark:text-amber-100",
  soon: "border-border bg-muted/50 text-muted-foreground",
};

interface UrgencyBadgeProps {
  urgencyDays: number;
  className?: string;
}

export function UrgencyBadge({ urgencyDays, className }: UrgencyBadgeProps) {
  const tone = getUrgencyTone(urgencyDays);

  return (
    <Badge
      variant="outline"
      className={cn("font-normal tabular-nums", toneClass[tone], className)}
    >
      {formatUrgencyLabel(urgencyDays)}
    </Badge>
  );
}
