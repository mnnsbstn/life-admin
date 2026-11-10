import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildInvitationEmailContent,
  buildInviteUrl,
} from "@/lib/email/invitation-mailer";

describe("invitation-mailer", () => {
  it("builds invite url", () => {
    assert.equal(
      buildInviteUrl("https://app.example", "abc123"),
      "https://app.example/invite/abc123",
    );
  });

  it("includes household name in subject", () => {
    const { subject, text } = buildInvitationEmailContent({
      to: "a@b.de",
      inviteUrl: "https://app.example/invite/tok",
      householdName: "Zu Hause",
      inviterDisplayName: "Alex",
      role: "member",
      expiresAt: "2026-12-01T00:00:00.000Z",
    });
    assert.match(subject, /Zu Hause/);
    assert.match(text, /Alex/);
    assert.match(text, /https:\/\/app\.example\/invite\/tok/);
  });
});
