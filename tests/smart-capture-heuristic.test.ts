import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseSmartCaptureHeuristic } from "@/lib/smart-capture/heuristic";

describe("smart-capture heuristic", () => {
  it("detects invoice with date and amount", () => {
    const result = parseSmartCaptureHeuristic(
      "Rechnung Stromversorger GmbH\nDatum: 10.11.2026\nGesamt: 89,50 €",
    );
    assert.equal(result.document?.documentType, "invoice");
    assert.equal(result.document?.issuedAt, "2026-11-10");
    assert.match(result.document?.notes ?? "", /Stromversorger/);
  });

  it("suggests reminder when a due date appears", () => {
    const result = parseSmartCaptureHeuristic(
      "Zahlung fällig am 15.12.2026\nBetrag 120,00 €",
    );
    assert.equal(result.reminder?.dueDate, "2026-12-15");
  });
});
