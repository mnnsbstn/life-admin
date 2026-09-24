import Link from "next/link";
import type { AttentionItem } from "@/lib/services/attention";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateDE } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

const severityIcon = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const severityBorder = {
  critical: "border-l-red-500/80",
  warning: "border-l-amber-500/80",
  info: "border-l-blue-500/70",
};

export function AttentionCard({ item }: { item: AttentionItem }) {
  const Icon = severityIcon[item.severity];
  return (
    <Link href={item.href} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
      <Card
        className={cn(
          "border-border/60 border-l-[3px] shadow-sm transition-colors hover:bg-muted/30",
          severityBorder[item.severity],
        )}
      >
        <CardContent className="flex gap-3 py-3">
          <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-sm font-medium leading-snug">{item.title}</p>
            {item.subtitle ? (
              <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
            ) : null}
            {item.dueDate ? (
              <p className="text-xs text-muted-foreground">{formatDateDE(item.dueDate)}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
