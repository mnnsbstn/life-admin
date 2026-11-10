import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";

import {
  createCalendarFeedToken,
  verifyCalendarFeedToken,
} from "@/lib/calendar/feed-token";

describe("calendar feed token", () => {
  const prev = process.env.CALENDAR_FEED_SIGNING_SECRET;

  beforeEach(() => {
    process.env.CALENDAR_FEED_SIGNING_SECRET = "test-secret";
  });

  afterEach(() => {
    if (prev === undefined) delete process.env.CALENDAR_FEED_SIGNING_SECRET;
    else process.env.CALENDAR_FEED_SIGNING_SECRET = prev;
  });

  it("creates and verifies token", () => {
    const token = createCalendarFeedToken("household-1");
    assert.ok(token);
    assert.equal(verifyCalendarFeedToken("household-1", token!), true);
    assert.equal(verifyCalendarFeedToken("household-2", token!), false);
  });
});
