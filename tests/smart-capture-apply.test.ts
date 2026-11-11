import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { DEMO_HOUSEHOLD_ID } from "@/lib/constants";
import { resolveInboxWebhookHouseholdId } from "@/lib/inbox/webhook-household";
import {
  applySmartCaptureToHousehold,
  pickSmartCaptureApplyTarget,
} from "@/lib/smart-capture/apply";
import type { SmartCaptureResult } from "@/lib/smart-capture/types";

const sample: SmartCaptureResult = {
  source: "heuristic",
  summary: "test",
  document: { title: "Rechnung" },
  reminder: { title: "Frist", dueDate: "2026-12-01" },
};

describe("inbox webhook household", () => {
  const prev = process.env.INBOX_WEBHOOK_HOUSEHOLD_ID;

  afterEach(() => {
    if (prev === undefined) delete process.env.INBOX_WEBHOOK_HOUSEHOLD_ID;
    else process.env.INBOX_WEBHOOK_HOUSEHOLD_ID = prev;
  });

  it("requires householdId when not pinned", () => {
    delete process.env.INBOX_WEBHOOK_HOUSEHOLD_ID;
    const res = resolveInboxWebhookHouseholdId();
    assert.ok("error" in res);
    assert.equal(res.error, "household-id-required");
  });

  it("uses pinned household", () => {
    process.env.INBOX_WEBHOOK_HOUSEHOLD_ID = "hh-pinned";
    const res = resolveInboxWebhookHouseholdId();
    assert.ok("householdId" in res);
    assert.equal(res.householdId, "hh-pinned");
  });
});

describe("smart capture apply target", () => {
  it("auto prefers reminder when due date present", () => {
    assert.equal(pickSmartCaptureApplyTarget(sample, "auto"), "reminder");
  });

  it("honours explicit document mode", () => {
    assert.equal(pickSmartCaptureApplyTarget(sample, "document"), "document");
  });
});

describe("smart capture apply mock", () => {
  it("creates reminder on mock backend", async () => {
    const applied = await applySmartCaptureToHousehold(
      DEMO_HOUSEHOLD_ID,
      sample,
      "reminder",
    );
    assert.equal(applied.kind, "reminder");
    assert.ok(applied.id.length > 0);
  });
});
