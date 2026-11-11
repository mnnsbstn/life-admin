import {
  getGoogleCalendarClientId,
  getGoogleCalendarClientSecret,
  getGoogleCalendarScopes,
} from "@/lib/integrations/google-calendar/config";

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
}

export function buildGoogleCalendarAuthorizeUrl(
  redirectUri: string,
  state: string,
): string {
  const clientId = getGoogleCalendarClientId();
  if (!clientId) throw new Error("Google Calendar OAuth not configured");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: getGoogleCalendarScopes(),
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCalendarCode(
  code: string,
  redirectUri: string,
): Promise<GoogleTokenResponse> {
  const clientId = getGoogleCalendarClientId();
  const clientSecret = getGoogleCalendarClientSecret();
  if (!clientId || !clientSecret) {
    throw new Error("Google Calendar OAuth not configured");
  }

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google token exchange failed: ${text.slice(0, 200)}`);
  }

  return (await res.json()) as GoogleTokenResponse;
}

export async function refreshGoogleCalendarAccessToken(
  refreshToken: string,
): Promise<GoogleTokenResponse> {
  const clientId = getGoogleCalendarClientId();
  const clientSecret = getGoogleCalendarClientSecret();
  if (!clientId || !clientSecret) {
    throw new Error("Google Calendar OAuth not configured");
  }

  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google token refresh failed: ${text.slice(0, 200)}`);
  }

  return (await res.json()) as GoogleTokenResponse;
}

export async function fetchGoogleAccountEmail(
  accessToken: string,
): Promise<string | undefined> {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return undefined;
  const data = (await res.json()) as { email?: string };
  return data.email;
}
