import { timingSafeEqual } from "node:crypto";

export function isInboxWebhookConfigured(): boolean {
  return Boolean(process.env.INBOX_WEBHOOK_SECRET?.trim());
}

export function verifyInboxWebhookSecret(
  authorizationHeader: string | null,
): boolean {
  const secret = process.env.INBOX_WEBHOOK_SECRET?.trim();
  if (!secret) return false;

  const expected = `Bearer ${secret}`;
  if (!authorizationHeader) return false;

  try {
    const a = Buffer.from(authorizationHeader, "utf8");
    const b = Buffer.from(expected, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
