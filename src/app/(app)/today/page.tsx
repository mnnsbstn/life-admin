"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useHouseholdData } from "@/hooks/use-household-data";
import { formatDateShort } from "@/lib/utils/dates";

export default function TodayPage() {
  const { loading, session, attentionItems, upcomingEvents } =
    useHouseholdData();

  const displayName =
    session?.user.displayName ?? siteConfig.demoUserDisplayName;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Good morning, {displayName}.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {loading
            ? "Loading your overview…"
            : `${attentionItems.length} things need your attention.`}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Attention</h2>
        <div className="space-y-2">
          {attentionItems.slice(0, 5).map((item) => (
            <Card key={item.id} className="shadow-sm">
              <CardHeader className="py-4">
                <CardTitle className="text-base font-medium">
                  {item.title}
                </CardTitle>
                {item.subtitle && (
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                )}
              </CardHeader>
            </Card>
          ))}
          {!loading && attentionItems.length === 0 && (
            <p className="text-sm text-muted-foreground">All clear for now.</p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Upcoming</h2>
        <Card className="shadow-sm">
          <CardContent className="divide-y divide-border/60 p-0">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span>{event.title}</span>
                <span className="tabular-nums text-muted-foreground">
                  {formatDateShort(event.date)}
                </span>
              </div>
            ))}
            {!loading && upcomingEvents.length === 0 && (
              <p className="px-4 py-3 text-sm text-muted-foreground">
                No upcoming events in range.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
