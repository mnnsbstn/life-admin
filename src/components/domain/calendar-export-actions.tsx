"use client";

import { CalendarPlus, Download, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildGoogleCalendarUrl } from "@/lib/calendar/google-calendar-url";
import { buildIcsCalendarFile } from "@/lib/calendar/ics";
import type { CalendarEventInput } from "@/lib/calendar/types";
import { buildShareMailtoUrl, type ShareEmailInput } from "@/lib/email/share-links";

interface CalendarExportActionsProps {
  event?: CalendarEventInput;
  icsFileName?: string;
  email?: ShareEmailInput;
  compact?: boolean;
}

function downloadIcs(fileName: string, event: CalendarEventInput) {
  const blob = new Blob([buildIcsCalendarFile(event)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName.endsWith(".ics") ? fileName : `${fileName}.ics`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function CalendarExportActions({
  event,
  icsFileName,
  email,
  compact,
}: CalendarExportActionsProps) {
  const size = compact ? "sm" : "default";
  const icsName = icsFileName ?? "termin";

  return (
    <div className="flex flex-wrap gap-2">
      {event ? (
        <>
          <Button variant="outline" size={size} asChild>
            <a
              href={buildGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CalendarPlus className="size-4" />
              Google Kalender
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            size={size}
            onClick={() => downloadIcs(icsName, event)}
          >
            <Download className="size-4" />
            .ics
          </Button>
        </>
      ) : null}
      {email ? (
        <Button variant="outline" size={size} asChild>
          <a href={buildShareMailtoUrl(email)}>
            <Mail className="size-4" />
            E-Mail
          </a>
        </Button>
      ) : null}
    </div>
  );
}
