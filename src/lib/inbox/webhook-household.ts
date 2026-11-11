/** Resolve target household for inbox webhook mutations. */
export function resolveInboxWebhookHouseholdId(
  requested?: string,
): { householdId: string } | { error: string; status: number } {
  const pinned = process.env.INBOX_WEBHOOK_HOUSEHOLD_ID?.trim();
  const requestedId = requested?.trim();

  if (pinned) {
    if (requestedId && requestedId !== pinned) {
      return { error: "household-mismatch", status: 403 };
    }
    return { householdId: pinned };
  }

  if (!requestedId) {
    return { error: "household-id-required", status: 400 };
  }

  return { householdId: requestedId };
}
