const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
].join(" ");

export function getGoogleCalendarScopes(): string {
  return SCOPES;
}

export function isGoogleCalendarOAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CALENDAR_CLIENT_ID?.trim() &&
      process.env.GOOGLE_CALENDAR_CLIENT_SECRET?.trim(),
  );
}

export function getGoogleCalendarClientId(): string | undefined {
  return process.env.GOOGLE_CALENDAR_CLIENT_ID?.trim() || undefined;
}

export function getGoogleCalendarClientSecret(): string | undefined {
  return process.env.GOOGLE_CALENDAR_CLIENT_SECRET?.trim() || undefined;
}
