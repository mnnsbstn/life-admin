import { createHmac, timingSafeEqual } from "node:crypto";

import { shouldUseSupabaseBackend } from "@/lib/supabase/env";
import { isSupabaseServiceRoleConfigured } from "@/lib/supabase/admin";

function signingSecret(): string | undefined {
  const value = process.env.CALENDAR_FEED_SIGNING_SECRET?.trim();
  return value || undefined;
}

export function isCalendarFeedSubscribeConfigured(): boolean {
  return Boolean(signingSecret());
}

export function isCalendarFeedSubscribeAvailable(): boolean {
  if (!isCalendarFeedSubscribeConfigured()) return false;
  if (shouldUseSupabaseBackend()) return isSupabaseServiceRoleConfigured();
  return true;
}

/** Opaque token for unauthenticated calendar subscribe URLs. */
export function createCalendarFeedToken(householdId: string): string | null {
  const secret = signingSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(householdId).digest("base64url");
}

export function verifyCalendarFeedToken(
  householdId: string,
  token: string,
): boolean {
  const expected = createCalendarFeedToken(householdId);
  if (!expected) return false;
  try {
    const a = Buffer.from(token, "utf8");
    const b = Buffer.from(expected, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function buildCalendarFeedHttpsUrl(
  appOrigin: string,
  householdId: string,
  token: string,
): string {
  const base = appOrigin.replace(/\/$/, "");
  return `${base}/api/calendar/${encodeURIComponent(householdId)}/${encodeURIComponent(token)}`;
}

export function buildCalendarWebcalUrl(httpsUrl: string): string {
  return httpsUrl.replace(/^https:/i, "webcal:");
}
