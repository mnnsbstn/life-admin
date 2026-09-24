import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { deriveReminderStatus } from "@/lib/domain/reminder-status";
import { buildAttentionItems } from "@/lib/services/dashboard.service";

describe("deriveReminderStatus", () => {
  it("marks past due dates as due", () => {
    const status = deriveReminderStatus(
      "2026-09-20",
      undefined,
      new Date("2026-09-24"),
    );
    assert.equal(status, "due");
  });

  it("marks completed reminders as completed", () => {
    const status = deriveReminderStatus(
      "2026-09-20",
      "2026-09-21T10:00:00.000Z",
      new Date("2026-09-24"),
    );
    assert.equal(status, "completed");
  });
});

describe("buildAttentionItems", () => {
  it("includes maintenance within attention window", () => {
    const items = buildAttentionItems({
      homeItems: [
        {
          id: "1",
          householdId: "h",
          name: "Heizung",
          category: "heating",
          nextMaintenanceAt: "2026-10-08",
          createdAt: "",
          updatedAt: "",
        },
      ],
      contracts: [],
      reminders: [],
      referenceDate: new Date("2026-09-24"),
    });

    assert.ok(items.some((item) => item.kind === "maintenance"));
  });
});
