"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  disconnectGoogleCalendarAction,
  syncGoogleCalendarAction,
} from "@/lib/actions/google-calendar";
import type { UserCalendarConnection } from "@/lib/domain/types";

interface GoogleCalendarPanelProps {
  configured: boolean;
  stateSigningConfigured: boolean;
  connection: UserCalendarConnection | null;
  readOnly: boolean;
}

export function GoogleCalendarPanel({
  configured,
  stateSigningConfigured,
  connection,
  readOnly,
}: GoogleCalendarPanelProps) {
  const [pending, startTransition] = useTransition();

  if (readOnly) {
    return (
      <p className="text-sm text-muted-foreground">
        Google OAuth ist in der GitHub-Pages-Demo nicht verfügbar.
      </p>
    );
  }

  if (!configured || !stateSigningConfigured) {
    return (
      <p className="text-sm text-muted-foreground">
        Setze{" "}
        <code className="rounded bg-muted px-1">GOOGLE_CALENDAR_CLIENT_ID</code>
        ,{" "}
        <code className="rounded bg-muted px-1">
          GOOGLE_CALENDAR_CLIENT_SECRET
        </code>{" "}
        und ein State-Secret (
        <code className="rounded bg-muted px-1">
          GOOGLE_OAUTH_STATE_SECRET
        </code>{" "}
        oder <code className="rounded bg-muted px-1">
          CALENDAR_FEED_SIGNING_SECRET
        </code>
        ). Siehe{" "}
        <code className="rounded bg-muted px-1">docs/GOOGLE_CALENDAR_OAUTH.md</code>
        .
      </p>
    );
  }

  const disconnect = () => {
    startTransition(async () => {
      try {
        await disconnectGoogleCalendarAction();
        toast.success("Google Kalender getrennt.");
      } catch {
        toast.error("Trennen fehlgeschlagen.");
      }
    });
  };

  const sync = () => {
    startTransition(async () => {
      try {
        const result = await syncGoogleCalendarAction();
        toast.success(
          `Sync: ${result.created} neu, ${result.skipped} bereits vorhanden.`,
        );
      } catch {
        toast.error("Synchronisation fehlgeschlagen.");
      }
    });
  };

  if (!connection) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Einmal verbinden, dann Termine in deinen Google Kalender pushen
          (idempotent pro Erinnerung/Vertrag).
        </p>
        <Button variant="outline" size="sm" className="w-fit" asChild>
          <Link href="/api/integrations/google/calendar/connect">
            Google Kalender verbinden
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm">
        Verbunden{connection.accountEmail ? ` als ${connection.accountEmail}` : ""}.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={sync}
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          Jetzt synchronisieren
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={disconnect}
        >
          Trennen
        </Button>
      </div>
    </div>
  );
}
