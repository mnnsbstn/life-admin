import { NextResponse } from "next/server";

import { resolveServerAppOrigin } from "@/lib/app-origin-server";
import { getAppSession } from "@/lib/auth/session";
import { buildMicrosoftCalendarAuthorizeUrl } from "@/lib/integrations/microsoft-calendar/oauth";
import { isMicrosoftCalendarOAuthConfigured } from "@/lib/integrations/microsoft-calendar/config";
import {
  createGoogleOAuthState,
  isGoogleOAuthStateSigningConfigured,
} from "@/lib/integrations/google-calendar/oauth-state";

export async function GET() {
  const origin = await resolveServerAppOrigin();
  const settings = new URL("/settings", origin);

  if (
    !isMicrosoftCalendarOAuthConfigured() ||
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

  const redirectUri = `${origin}/api/integrations/microsoft/calendar/callback`;
  const url = buildMicrosoftCalendarAuthorizeUrl(redirectUri, state);
  return NextResponse.redirect(url);
}
