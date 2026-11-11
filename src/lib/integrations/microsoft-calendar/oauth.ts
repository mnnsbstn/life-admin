import {
  getMicrosoftCalendarClientId,
  getMicrosoftCalendarClientSecret,
  getMicrosoftCalendarScopes,
  microsoftOAuthBaseUrl,
} from "@/lib/integrations/microsoft-calendar/config";

export interface MicrosoftTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
}

export function buildMicrosoftCalendarAuthorizeUrl(
  redirectUri: string,
  state: string,
): string {
  const clientId = getMicrosoftCalendarClientId();
  if (!clientId) throw new Error("Microsoft Calendar OAuth not configured");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    response_mode: "query",
    scope: getMicrosoftCalendarScopes(),
    state,
  });

  return `${microsoftOAuthBaseUrl()}/authorize?${params.toString()}`;
}

export async function exchangeMicrosoftCalendarCode(
  code: string,
  redirectUri: string,
): Promise<MicrosoftTokenResponse> {
  const clientId = getMicrosoftCalendarClientId();
  const clientSecret = getMicrosoftCalendarClientSecret();
  if (!clientId || !clientSecret) {
    throw new Error("Microsoft Calendar OAuth not configured");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const res = await fetch(`${microsoftOAuthBaseUrl()}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Microsoft token exchange failed: ${text.slice(0, 200)}`);
  }

  return (await res.json()) as MicrosoftTokenResponse;
}

export async function refreshMicrosoftCalendarAccessToken(
  refreshToken: string,
): Promise<MicrosoftTokenResponse> {
  const clientId = getMicrosoftCalendarClientId();
  const clientSecret = getMicrosoftCalendarClientSecret();
  if (!clientId || !clientSecret) {
    throw new Error("Microsoft Calendar OAuth not configured");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const res = await fetch(`${microsoftOAuthBaseUrl()}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Microsoft token refresh failed: ${text.slice(0, 200)}`);
  }

  return (await res.json()) as MicrosoftTokenResponse;
}

export async function fetchMicrosoftAccountEmail(
  accessToken: string,
): Promise<string | undefined> {
  const res = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Prefer: 'outlook.body-content-type="text"',
    },
  });
  if (!res.ok) return undefined;
  const data = (await res.json()) as { mail?: string; userPrincipalName?: string };
  return data.mail ?? data.userPrincipalName;
}
