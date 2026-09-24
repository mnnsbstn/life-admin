import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  mapContractRow,
  mapContractToRow,
} from "@/lib/repositories/supabase/mappers/contract";

describe("contract mapper", () => {
  it("maps row to domain and back", () => {
    const row = {
      id: "c1",
      household_id: "h1",
      name: "Internet",
      provider: "Telekom",
      category: "internet" as const,
      cost_cents: 4999,
      currency: "EUR",
      payment_interval: "monthly" as const,
      start_date: "2024-01-01",
      minimum_term_months: 24,
      notice_period_days: 30,
      next_cancellation_date: "2026-10-01",
      auto_renewal: true,
      contract_end_date: null,
      notes: null,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };

    const domain = mapContractRow(row);
    assert.equal(domain.name, "Internet");
    assert.equal(domain.costCents, 4999);

    const back = mapContractToRow(domain);
    assert.equal(back.household_id, "h1");
    assert.equal(back.cost_cents, 4999);
  });
});
