import { Sparkles } from "lucide-react";

import { AttentionCard } from "@/components/domain/attention-card";
import { EmptyState } from "@/components/domain/empty-state";
import { UpcomingList } from "@/components/domain/upcoming-list";
import type { AttentionItem, UpcomingItem } from "@/lib/domain/types";
import { formatAttentionSummary } from "@/lib/format/urgency";
import { getTimeGreeting } from "@/lib/format/greeting";

interface TodayViewProps {
  displayName: string;
  attention: AttentionItem[];
  upcoming: UpcomingItem[];
}

export function TodayView({
  displayName,
  attention,
  upcoming,
}: TodayViewProps) {
  return (
    <div className="flex flex-col gap-10">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem] md:leading-tight">
          {getTimeGreeting(displayName)}
        </h1>
        <p className="text-sm text-muted-foreground md:text-[15px]">
          {formatAttentionSummary(attention.length)}
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Aufmerksamkeit
        </h2>
        {attention.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="Ruhiger Tag"
            description="Keine Fristen oder Wartungen in den nächsten 30 Tagen — oder alles erledigt."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {attention.map((item) => (
              <li key={item.id}>
                <AttentionCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Demnächst
        </h2>
        <UpcomingList items={upcoming} />
      </section>
    </div>
  );
}
