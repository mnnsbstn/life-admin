import {
  contractCalendarExports,
  reminderCalendarEvent,
} from "@/lib/calendar/event-builders";
import {
  ensureGoogleAccessToken,
  upsertGoogleCalendarEvent,
} from "@/lib/integrations/google-calendar/sync";
import { withDerivedReminderStatus } from "@/lib/domain/reminder-status";
import { getRepositories } from "@/lib/repositories";

export interface GoogleCalendarSyncResult {
  created: number;
  skipped: number;
}

export async function syncHouseholdToGoogleCalendar(
  userId: string,
  householdId: string,
): Promise<GoogleCalendarSyncResult> {
  const repos = getRepositories();
  const connection = await repos.calendarIntegrations.getConnection(
    userId,
    "google",
  );
  if (!connection) {
    throw new Error("Google Kalender ist nicht verbunden.");
  }

  const [reminders, contracts] = await Promise.all([
    repos.reminders.list({ householdId }),
    repos.contracts.list({ householdId }),
  ]);

  const accessToken = await ensureGoogleAccessToken(
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
      "google",
      sourceKind,
      sourceId,
    );
    if (existing) {
      skipped += 1;
      return;
    }
    const externalId = await upsertGoogleCalendarEvent(
      accessToken,
      connection.calendarId,
      event,
    );
    await repos.calendarIntegrations.recordSyncedEvent({
      userId,
      provider: "google",
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
