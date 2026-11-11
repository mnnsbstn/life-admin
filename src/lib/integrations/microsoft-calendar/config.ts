const SCOPES = [
  "openid",
  "email",
  "offline_access",
  "Calendars.ReadWrite",
].join(" ");

const DEFAULT_TENANT = "common";

export function getMicrosoftCalendarScopes(): string {
  return SCOPES;
}

export function getMicrosoftTenantId(): string {
  return process.env.MICROSOFT_CALENDAR_TENANT_ID?.trim() || DEFAULT_TENANT;
}

export function isMicrosoftCalendarOAuthConfigured(): boolean {
  return Boolean(
    process.env.MICROSOFT_CALENDAR_CLIENT_ID?.trim() &&
      process.env.MICROSOFT_CALENDAR_CLIENT_SECRET?.trim(),
  );
}

export function getMicrosoftCalendarClientId(): string | undefined {
  return process.env.MICROSOFT_CALENDAR_CLIENT_ID?.trim() || undefined;
}

export function getMicrosoftCalendarClientSecret(): string | undefined {
  return process.env.MICROSOFT_CALENDAR_CLIENT_SECRET?.trim() || undefined;
}

export function microsoftOAuthBaseUrl(): string {
  const tenant = getMicrosoftTenantId();
  return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0`;
}
