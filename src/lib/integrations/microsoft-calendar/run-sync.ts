import {
  contractCalendarExports,
  reminderCalendarEvent,
} from "@/lib/calendar/event-builders";
import {
  ensureMicrosoftAccessToken,
  upsertMicrosoftCalendarEvent,
} from "@/lib/integrations/microsoft-calendar/sync";
import { withDerivedReminderStatus } from "@/lib/domain/reminder-status";
import type { GoogleCalendarSyncResult } from "@/lib/integrations/google-calendar/run-sync";
import { getRepositories } from "@/lib/repositories";

export async function syncHouseholdToMicrosoftCalendar(
  userId: string,
  householdId: string,
): Promise<GoogleCalendarSyncResult> {
  const repos = getRepositories();
  const connection = await repos.calendarIntegrations.getConnection(
    userId,
    "microsoft",
  );
  if (!connection) {
    throw new Error("Microsoft Kalender ist nicht verbunden.");
  }

  const [reminders, contracts] = await Promise.all([
    repos.reminders.list({ householdId }),
    repos.contracts.list({ householdId }),
  ]);

  const accessToken = await ensureMicrosoftAccessToken(
    connection,
    repos.calendarIntegrations.updateAccessToken.bind(repos.calendarIntegrations),
  );

  let created = 0;
  let skipped = 0;

  const push = async (
    sourceKind: string,
    sourceId: string,
    event: ReturnType<typeof reminderCalendarEvent>,
  ) => {
    const existing = await repos.calendarIntegrations.getSyncedEvent(
      userId,
      "microsoft",
      sourceKind,
      sourceId,
    );
    if (existing) {
      skipped += 1;
      return;
    }
    const externalId = await upsertMicrosoftCalendarEvent(accessToken, event);
    await repos.calendarIntegrations.recordSyncedEvent({
      userId,
      provider: "microsoft",
      sourceKind,
      sourceId,
      externalEventId: externalId,
    });
    created += 1;
  };

  for (const reminder of reminders) {
    const status = withDerivedReminderStatus(reminder).status;
    if (status === "completed") continue;
    await push("reminder", reminder.id, reminderCalendarEvent(reminder));
  }

  for (const contract of contracts) {
    for (const item of contractCalendarExports(contract)) {
      await push(`contract_${item.id}`, contract.id, item.event);
    }
  }

  return { created, skipped };
}
