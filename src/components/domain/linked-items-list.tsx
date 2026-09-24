import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface LinkedItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
}

interface LinkedItemsListProps {
  items: LinkedItem[];
  emptyLabel: string;
}

export function LinkedItemsList({ items, emptyLabel }: LinkedItemsListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <ul className="divide-y divide-border/60">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={item.href}
            className="group flex items-center justify-between gap-3 py-2.5 text-sm transition-colors hover:text-foreground"
          >
            <span className="min-w-0">
              <span className="block truncate font-medium">{item.title}</span>
              {item.subtitle ? (
                <span className="block truncate text-xs text-muted-foreground">
                  {item.subtitle}
                </span>
              ) : null}
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
