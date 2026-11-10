import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildGoogleCalendarUrl } from "@/lib/calendar/google-calendar-url";
import { buildIcsCalendarFile, buildIcsFeed } from "@/lib/calendar/ics";
import { buildHouseholdCalendarEvents } from "@/lib/calendar/household-feed";
import { contractCalendarExports } from "@/lib/calendar/event-builders";

describe("calendar export", () => {
  it("builds Google Calendar URL with exclusive end date", () => {
    const url = buildGoogleCalendarUrl({
      title: "Test",
      date: "2026-12-15",
    });
    assert.match(url, /calendar\.google\.com/);
    assert.match(url, /20261215%2F20261216/);
  });

  it("builds ICS with all-day bounds", () => {
    const ics = buildIcsCalendarFile({
      title: "Miete",
      date: "2026-01-01",
    });
    assert.match(ics, /DTSTART;VALUE=DATE:20260101/);
    assert.match(ics, /DTEND;VALUE=DATE:20260102/);
  });

  it("builds multi-event ICS feed", () => {
    const ics = buildIcsFeed(
      [
        { title: "A", date: "2026-01-01" },
        { title: "B", date: "2026-02-01" },
      ],
      "Test",
    );
    assert.match(ics, /BEGIN:VEVENT/);
    assert.equal((ics.match(/BEGIN:VEVENT/g) ?? []).length, 2);
    assert.match(ics, /X-WR-CALNAME:Test/);
  });

  it("aggregates household calendar events", () => {
    const events = buildHouseholdCalendarEvents(
      [
        {
          id: "r1",
          householdId: "h",
          title: "Test",
          dueDate: "2026-03-01",
          status: "upcoming",
          priority: "medium",
          link: { type: "standalone" },
          createdAt: "",
          updatedAt: "",
        },
      ],
      [],
    );
    assert.equal(events.length, 1);
    assert.equal(events[0]?.date, "2026-03-01");
  });

  it("exports cancellation and end for contracts", () => {
    const exports = contractCalendarExports({
      id: "c1",
      name: "Strom",
      provider: "EVU",
      category: "electricity",
      startDate: "2024-01-01",
      minimumTermMonths: 12,
      noticePeriodDays: 30,
      nextCancellationDate: "2026-06-01",
      contractEndDate: "2027-12-31",
      autoRenewal: true,
      paymentInterval: "monthly",
      costCents: 5000,
      currency: "EUR",
      householdId: "h1",
      createdAt: "",
      updatedAt: "",
    });
    assert.equal(exports.length, 2);
    assert.equal(exports[0]?.id, "cancellation");
    assert.equal(exports[1]?.id, "end");
  });
});
