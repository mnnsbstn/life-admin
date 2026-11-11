async function blocked(): Promise<never> {
  throw new Error("Read-only GitHub Pages demo");
}

export async function disconnectGoogleCalendarAction(): Promise<void> {
  return blocked();
}

export async function syncGoogleCalendarAction(): Promise<{
  created: number;
  skipped: number;
}> {
  return blocked();
}

