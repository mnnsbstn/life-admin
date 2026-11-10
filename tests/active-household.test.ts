import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveActiveHousehold } from "@/lib/auth/active-household";
import type { Household } from "@/lib/domain/types";

const households: Household[] = [
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Wohnung",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "22222222-2222-4222-8222-222222222223",
    name: "Ferienhaus",
    createdAt: "2024-06-01T00:00:00.000Z",
  },
];

describe("resolveActiveHousehold", () => {
  it("uses preferred id when member", () => {
    assert.equal(
      resolveActiveHousehold(households, households[1].id)?.id,
      households[1].id,
    );
  });

  it("falls back to default id", () => {
    assert.equal(
      resolveActiveHousehold(households, undefined, households[0].id)?.id,
      households[0].id,
    );
  });

  it("ignores unknown preferred id", () => {
    assert.equal(
      resolveActiveHousehold(households, "00000000-0000-0000-0000-000000000099")
        ?.name,
      "Ferienhaus",
    );
  });
});
