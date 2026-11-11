import { NextResponse } from "next/server";

import { getAppSession } from "@/lib/auth/session";
import { resolveServerAppOrigin } from "@/lib/app-origin-server";
import {
  buildGoogleCalendarAuthorizeUrl,
} from "@/lib/integrations/google-calendar/oauth";
import {
  createGoogleOAuthState,
  isGoogleOAuthStateSigningConfigured,
} from "@/lib/integrations/google-calendar/oauth-state";
import {
  isGoogleCalendarOAuthConfigured,
} from "@/lib/integrations/google-calendar/config";

export async function GET() {
  const origin = await resolveServerAppOrigin();
  const settings = new URL("/settings", origin);

  if (
    !isGoogleCalendarOAuthConfigured() ||
    !isGoogleOAuthStateSigningConfigured()
  ) {
    settings.searchParams.set("calendar", "unconfigured");
    return NextResponse.redirect(settings);
  }

  const session = await getAppSession();
  const state = createGoogleOAuthState(session.userId);
  if (!state) {
    settings.searchParams.set("calendar", "unconfigured");
    return NextResponse.redirect(settings);
  }
  const redirectUri = `${origin}/api/integrations/google/calendar/callback`;
  const url = buildGoogleCalendarAuthorizeUrl(redirectUri, state);
  return NextResponse.redirect(url);
}
