import { cookies } from "next/headers";

import { isStaticExportBuild } from "@/lib/deployment-mode";
import type { Household } from "@/lib/domain/types";

export const ACTIVE_HOUSEHOLD_COOKIE = "la_active_household";

/** Demo + production household ids (relaxed for seed UUIDs). */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function readActiveHouseholdId(): Promise<string | undefined> {
  if (isStaticExportBuild()) {
    return undefined;
  }

  const jar = await cookies();
  const raw = jar.get(ACTIVE_HOUSEHOLD_COOKIE)?.value;
  if (!raw || !UUID_RE.test(raw)) return undefined;
  return raw;
}

export async function writeActiveHouseholdId(householdId: string): Promise<void> {
  if (!UUID_RE.test(householdId)) {
    throw new Error("Invalid household id");
  }

  if (isStaticExportBuild()) {
    return;
  }

  const jar = await cookies();
  jar.set(ACTIVE_HOUSEHOLD_COOKIE, householdId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  });
}

/** Pick stored household when the user is a member; otherwise fall back. */
export function resolveActiveHousehold(
  households: Household[],
  preferredId: string | undefined,
  fallbackId?: string,
): Household | undefined {
  if (households.length === 0) return undefined;

  const byPreference = preferredId
    ? households.find((h) => h.id === preferredId)
    : undefined;
  if (byPreference) return byPreference;

  if (fallbackId) {
    const byFallback = households.find((h) => h.id === fallbackId);
    if (byFallback) return byFallback;
  }

  return [...households].sort((a, b) =>
    a.name.localeCompare(b.name, "de"),
  )[0];
}
