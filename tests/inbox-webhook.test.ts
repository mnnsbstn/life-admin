import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import {
  isInboxWebhookConfigured,
  verifyInboxWebhookSecret,
} from "@/lib/inbox/webhook-auth";

describe("inbox webhook auth", () => {
  const prev = process.env.INBOX_WEBHOOK_SECRET;

  beforeEach(() => {
    process.env.INBOX_WEBHOOK_SECRET = "inbox-test-secret";
  });

  afterEach(() => {
    if (prev === undefined) delete process.env.INBOX_WEBHOOK_SECRET;
    else process.env.INBOX_WEBHOOK_SECRET = prev;
  });

  it("checks bearer secret", () => {
    assert.equal(isInboxWebhookConfigured(), true);
    assert.equal(
      verifyInboxWebhookSecret("Bearer inbox-test-secret"),
      true,
    );
    assert.equal(verifyInboxWebhookSecret("Bearer wrong"), false);
  });
});
