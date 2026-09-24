import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { UpcomingItem } from "@/lib/domain/types";
import { formatShortDate } from "@/lib/format/date";
import { cn } from "@/lib/utils";

interface UpcomingListProps {
  items: UpcomingItem[];
  className?: string;
}

export function UpcomingList({ items, className }: UpcomingListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Keine Termine in den nächsten Wochen.
      </p>
    );
  }

  return (
    <ul className={cn("divide-y divide-border/70 rounded-xl border border-border/70 bg-card shadow-sm", className)}>
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={item.href}
            className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-muted/30"
          >
            <span className="w-14 shrink-0 text-sm tabular-nums text-muted-foreground">
              {formatShortDate(item.date)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">
                {item.title}
              </span>
              {item.subtitle ? (
                <span className="block truncate text-xs text-muted-foreground">
                  {item.subtitle}
                </span>
              ) : null}
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
