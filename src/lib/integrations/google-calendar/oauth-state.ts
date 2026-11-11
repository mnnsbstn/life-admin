import { createHmac, timingSafeEqual } from "node:crypto";

function stateSecret(): string | undefined {
  return (
    process.env.GOOGLE_OAUTH_STATE_SECRET?.trim() ||
    process.env.CALENDAR_FEED_SIGNING_SECRET?.trim() ||
    undefined
  );
}

export function isGoogleOAuthStateSigningConfigured(): boolean {
  return Boolean(stateSecret());
}

export function createGoogleOAuthState(userId: string): string | null {
  const secret = stateSecret();
  if (!secret) return null;
  const issuedAt = String(Date.now());
  const payload = `${userId}.${issuedAt}`;
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyGoogleOAuthState(state: string): string | null {
  const secret = stateSecret();
  if (!secret) return null;
  const parts = state.split(".");
  if (parts.length !== 3) return null;
  const [userId, issuedAt, sig] = parts;
  if (!userId || !issuedAt || !sig) return null;
  const ageMs = Date.now() - Number(issuedAt);
  if (!Number.isFinite(ageMs) || ageMs < 0 || ageMs > 1000 * 60 * 15) {
    return null;
  }
  const payload = `${userId}.${issuedAt}`;
  const expected = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  return userId;
}
