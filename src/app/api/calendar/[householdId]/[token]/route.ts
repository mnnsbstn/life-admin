import { NextResponse } from "next/server";

import { loadHouseholdCalendarFeed } from "@/lib/calendar/feed-data";
import { verifyCalendarFeedToken } from "@/lib/calendar/feed-token";
import { buildIcsFeed } from "@/lib/calendar/ics";

type RouteContext = {
  params: Promise<{ householdId: string; token: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { householdId, token } = await context.params;

  if (!verifyCalendarFeedToken(householdId, token)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const feed = await loadHouseholdCalendarFeed(householdId);
  if (!feed) {
    return new NextResponse("Feed unavailable", { status: 503 });
  }

  const body = buildIcsFeed(feed.events, `Life Admin — ${feed.householdName}`);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "private, max-age=300",
    },
  });
}
