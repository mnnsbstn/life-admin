import Link from "next/link";
import type { AttentionItem } from "@/lib/services/attention";
import { AttentionCard } from "./attention-card";
import { LinkButton } from "@/components/shared/link-button";
import { EmptyState } from "@/components/shared/empty-state";

export function AttentionList({
  items,
  totalCount,
}: {
  items: AttentionItem[];
  totalCount: number;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing urgent"
        description="We'll surface warranties, maintenance, and reminders here when they're due."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Needs attention</h3>
        {totalCount > items.length ? (
          <LinkButton href="/reminders" variant="ghost" size="sm" className="h-8 text-xs">
            View all
          </LinkButton>
        ) : null}
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <AttentionCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
