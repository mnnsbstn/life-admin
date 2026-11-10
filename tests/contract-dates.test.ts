import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  computeMinimumTermEnd,
  computeNoticeDeadline,
  resolveNextCancellationDate,
} from "@/lib/domain/contract-dates";

describe("contract-dates", () => {
  it("computes minimum term end from start date", () => {
    assert.equal(computeMinimumTermEnd("2026-01-15", 12), "2027-01-15");
  });

  it("computes notice deadline before term end", () => {
    assert.equal(computeNoticeDeadline("2027-01-15", 30), "2026-12-16");
  });

  it("prefers explicit nextCancellationDate", () => {
    assert.equal(
      resolveNextCancellationDate({
        nextCancellationDate: "2026-10-01",
        startDate: "2020-01-01",
        minimumTermMonths: 12,
        noticePeriodDays: 30,
      }),
      "2026-10-01",
    );
  });

  it("derives cancellation date from term and notice period", () => {
    assert.equal(
      resolveNextCancellationDate({
        startDate: "2026-01-01",
        minimumTermMonths: 12,
        noticePeriodDays: 30,
      }),
      "2026-12-02",
    );
  });
});
