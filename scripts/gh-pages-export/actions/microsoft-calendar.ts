async function blocked(): Promise<never> {
  throw new Error("Read-only GitHub Pages demo");
}

export async function disconnectMicrosoftCalendarAction(): Promise<void> {
  return blocked();
}

export async function syncMicrosoftCalendarAction(): Promise<{
  created: number;
  skipped: number;
}> {
  return blocked();
}
