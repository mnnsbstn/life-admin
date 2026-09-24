import Link from "next/link";
import type { UpcomingEvent } from "@/lib/services/upcoming";
import { formatUpcomingLine } from "@/lib/services/upcoming";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

export function UpcomingTimeline({ events }: { events: UpcomingEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        title="No upcoming dates"
        description="Maintenance, renewals, and reminders will appear on your timeline."
      />
    );
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Upcoming</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={event.href}
                className="block rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted/50"
              >
                {formatUpcomingLine(event)}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
