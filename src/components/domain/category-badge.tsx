import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  label: string;
  className?: string;
}

export function CategoryBadge({ label, className }: CategoryBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("font-normal text-muted-foreground", className)}
    >
      {label}
    </Badge>
  );
}
