"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CalendarFeedSubscribe } from "@/features/settings/components/calendar-feed-subscribe";
import { buildIcsFeed } from "@/lib/calendar/ics";
import type { CalendarEventInput } from "@/lib/calendar/types";

interface HouseholdCalendarExportProps {
  householdName: string;
  events: CalendarEventInput[];
  feedHttpsUrl?: string | null;
  feedWebcalUrl?: string | null;
}

export function HouseholdCalendarExport({
  householdName,
  events,
  feedHttpsUrl,
  feedWebcalUrl,
}: HouseholdCalendarExportProps) {
  const download = () => {
    const safeName = householdName.replace(/[^\wäöüÄÖÜß -]+/g, "").trim() || "haushalt";
    const blob = new Blob(
      [buildIcsFeed(events, `Life Admin — ${householdName}`)],
      { type: "text/calendar;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `life-admin-${safeName}.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        {events.length > 0
          ? `${events.length} Termine (offene Erinnerungen, Vertrags-Kündigung/Ende).`
          : "Keine exportierbaren Termine im aktiven Haushalt."}
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit gap-2"
        disabled={events.length === 0}
        onClick={download}
      >
        <Download className="size-4" />
        Kalenderdatei (.ics)
      </Button>
      {feedHttpsUrl && feedWebcalUrl ? (
        <CalendarFeedSubscribe httpsUrl={feedHttpsUrl} webcalUrl={feedWebcalUrl} />
      ) : null}
    </div>
  );
}
