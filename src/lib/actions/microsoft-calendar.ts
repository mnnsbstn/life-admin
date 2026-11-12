"use server";

import { revalidatePath } from "next/cache";

import { getAppSession } from "@/lib/auth/session";
import { syncHouseholdToMicrosoftCalendar } from "@/lib/integrations/microsoft-calendar/run-sync";
import { getRepositories } from "@/lib/repositories";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";

export async function disconnectMicrosoftCalendarAction(): Promise<void> {
  if (isGitHubPagesPreview()) {
    throw new Error("Read-only GitHub Pages demo");
  }

  const session = await getAppSession();
  await getRepositories().calendarIntegrations.deleteConnection(
    session.userId,
    "microsoft",
  );
  revalidatePath("/settings");
}

export async function syncMicrosoftCalendarAction(): Promise<{
  created: number;
  skipped: number;
}> {
  if (isGitHubPagesPreview()) {
    throw new Error("Read-only GitHub Pages demo");
  }

  const session = await getAppSession();
  const result = await syncHouseholdToMicrosoftCalendar(
    session.userId,
    session.householdId,
  );
  revalidatePath("/settings");
  return result;
}
