import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { normalizeSupabaseProjectUrl } from "@/lib/supabase/env";

describe("normalizeSupabaseProjectUrl", () => {
  it("strips accidental API settings path", () => {
    assert.equal(
      normalizeSupabaseProjectUrl(
        "https://oxnyvzsvrvnncorsgyjo.supabase.co/settings/api",
      ),
      "https://oxnyvzsvrvnncorsgyjo.supabase.co",
    );
  });

  it("maps dashboard URL to project API origin", () => {
    assert.equal(
      normalizeSupabaseProjectUrl(
        "https://supabase.com/dashboard/project/oxnyvzsvrvnncorsgyjo/settings/api",
      ),
      "https://oxnyvzsvrvnncorsgyjo.supabase.co",
    );
  });

  it("returns undefined for invalid URL", () => {
    assert.equal(normalizeSupabaseProjectUrl("not-a-url"), undefined);
  });
});
