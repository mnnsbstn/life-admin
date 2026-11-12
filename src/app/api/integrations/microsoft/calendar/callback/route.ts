import { NextResponse } from "next/server";

import { resolveServerAppOrigin } from "@/lib/app-origin-server";
import {
  exchangeMicrosoftCalendarCode,
  fetchMicrosoftAccountEmail,
} from "@/lib/integrations/microsoft-calendar/oauth";
import { verifyGoogleOAuthState } from "@/lib/integrations/google-calendar/oauth-state";
import { getRepositories } from "@/lib/repositories";

export async function GET(request: Request) {
  const origin = await resolveServerAppOrigin();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const settings = new URL("/settings", origin);

  if (!code || !state) {
    settings.searchParams.set("calendar", "error");
    return NextResponse.redirect(settings);
  }

  const userId = verifyGoogleOAuthState(state);
  if (!userId) {
    settings.searchParams.set("calendar", "error");
    return NextResponse.redirect(settings);
  }

  try {
    const redirectUri = `${origin}/api/integrations/microsoft/calendar/callback`;
    const tokens = await exchangeMicrosoftCalendarCode(code, redirectUri);
    if (!tokens.refresh_token) {
      settings.searchParams.set("calendar", "no-refresh");
      return NextResponse.redirect(settings);
    }

    const expiresAt = new Date(
      Date.now() + tokens.expires_in * 1000,
    ).toISOString();
    const accountEmail = await fetchMicrosoftAccountEmail(tokens.access_token);

    const repos = getRepositories();
    await repos.calendarIntegrations.upsertConnection({
      userId,
      provider: "microsoft",
      accountEmail,
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
      accessTokenExpiresAt: expiresAt,
      calendarId: "primary",
    });

    settings.searchParams.set("calendar", "connected");
    return NextResponse.redirect(settings);
  } catch {
    settings.searchParams.set("calendar", "error");
    return NextResponse.redirect(settings);
  }
}
