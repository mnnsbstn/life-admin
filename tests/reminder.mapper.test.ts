import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  mapReminderRow,
  mapReminderToRow,
} from "@/lib/repositories/supabase/mappers/reminder";

describe("reminder mapper", () => {
  it("maps link and derives status", () => {
    const row = {
      id: "r1",
      household_id: "h1",
      title: "Heizung warten",
      due_date: "2026-09-20",
      status: "upcoming" as const,
      priority: "high" as const,
      link_type: "home_item" as const,
      link_target_id: "home-1",
      notes: null,
      completed_at: null,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };

    const domain = mapReminderRow(row);
    assert.equal(domain.link.type, "home_item");
    assert.equal(domain.status, "due");

    const back = mapReminderToRow(domain);
    assert.equal(back.link_type, "home_item");
    assert.equal(back.link_target_id, "home-1");
  });

  it("maps completed reminder", () => {
    const row = {
      id: "r2",
      household_id: "h1",
      title: "Done",
      due_date: "2026-09-01",
      status: "completed" as const,
      priority: "low" as const,
      link_type: "standalone" as const,
      link_target_id: null,
      notes: null,
      completed_at: "2026-09-02T10:00:00Z",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };

    const domain = mapReminderRow(row);
    assert.equal(domain.status, "completed");
  });
});
