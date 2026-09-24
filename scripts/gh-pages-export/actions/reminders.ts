async function blocked(): Promise<never> {
  throw new Error("Read-only GitHub Pages demo");
}

export async function completeReminder(_reminderId: string) {
  return blocked();
}

export async function reopenReminder(_reminderId: string) {
  return blocked();
}

export async function deleteReminderAction(_id: string) {
  return blocked();
}
