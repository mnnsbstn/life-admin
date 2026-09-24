import Link from "next/link";

import { UrgencyBadge } from "@/components/domain/urgency-badge";
import { attentionKindMeta } from "@/lib/domain/attention-meta";
import type { AttentionItem } from "@/lib/domain/types";
import { formatDisplayDate } from "@/lib/format/date";
import { cn } from "@/lib/utils";

interface AttentionCardProps {
  item: AttentionItem;
  className?: string;
}

export function AttentionCard({ item, className }: AttentionCardProps) {
  const meta = attentionKindMeta[item.kind];
  const Icon = meta.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-start gap-4 rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-all hover:border-border hover:shadow-md",
        className,
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground transition-colors group-hover:bg-muted/70">
        <Icon className="size-4" strokeWidth={1.75} />
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug text-foreground">
            {item.title}
          </p>
          <UrgencyBadge urgencyDays={item.urgencyDays} />
        </div>
        {item.subtitle ? (
          <p className="text-sm text-muted-foreground">{item.subtitle}</p>
        ) : null}
        <p className="text-xs text-muted-foreground/80">
          {meta.label} · {formatDisplayDate(item.dueDate)}
        </p>
      </div>
    </Link>
  );
}
