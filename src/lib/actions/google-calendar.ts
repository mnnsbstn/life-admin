"use server";

import { revalidatePath } from "next/cache";

import { getAppSession } from "@/lib/auth/session";
import { syncHouseholdToGoogleCalendar } from "@/lib/integrations/google-calendar/run-sync";
import { getRepositories } from "@/lib/repositories";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";

export async function disconnectGoogleCalendarAction(): Promise<void> {
  if (isGitHubPagesPreview()) {
    throw new Error("Read-only GitHub Pages demo");
  }

  const session = await getAppSession();
  await getRepositories().calendarIntegrations.deleteConnection(
    session.userId,
    "google",
  );
  revalidatePath("/settings");
}

export async function syncGoogleCalendarAction(): Promise<{
  created: number;
  skipped: number;
}> {
  if (isGitHubPagesPreview()) {
    throw new Error("Read-only GitHub Pages demo");
  }

  const session = await getAppSession();
  const result = await syncHouseholdToGoogleCalendar(
    session.userId,
    session.householdId,
  );
  revalidatePath("/settings");
  return result;
}
