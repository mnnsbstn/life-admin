import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import {
  createGoogleOAuthState,
  verifyGoogleOAuthState,
} from "@/lib/integrations/google-calendar/oauth-state";

describe("google oauth state", () => {
  const prev = process.env.GOOGLE_OAUTH_STATE_SECRET;

  beforeEach(() => {
    process.env.GOOGLE_OAUTH_STATE_SECRET = "test-oauth-state";
  });

  afterEach(() => {
    if (prev === undefined) delete process.env.GOOGLE_OAUTH_STATE_SECRET;
    else process.env.GOOGLE_OAUTH_STATE_SECRET = prev;
  });

  it("round-trips user id", () => {
    const state = createGoogleOAuthState("user-abc");
    assert.ok(state);
    assert.equal(verifyGoogleOAuthState(state!), "user-abc");
    assert.equal(verifyGoogleOAuthState("invalid"), null);
  });
});
