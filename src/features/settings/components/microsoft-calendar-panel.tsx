"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  disconnectMicrosoftCalendarAction,
  syncMicrosoftCalendarAction,
} from "@/lib/actions/microsoft-calendar";
import type { UserCalendarConnection } from "@/lib/domain/types";

interface MicrosoftCalendarPanelProps {
  configured: boolean;
  stateSigningConfigured: boolean;
  connection: UserCalendarConnection | null;
  readOnly: boolean;
}

export function MicrosoftCalendarPanel({
  configured,
  stateSigningConfigured,
  connection,
  readOnly,
}: MicrosoftCalendarPanelProps) {
  const [pending, startTransition] = useTransition();

  if (readOnly) {
    return (
      <p className="text-sm text-muted-foreground">
        Microsoft OAuth ist in der GitHub-Pages-Demo nicht verfügbar.
      </p>
    );
  }

  if (!configured || !stateSigningConfigured) {
    return (
      <p className="text-sm text-muted-foreground">
        Setze{" "}
        <code className="rounded bg-muted px-1">
          MICROSOFT_CALENDAR_CLIENT_ID
        </code>
        ,{" "}
        <code className="rounded bg-muted px-1">
          MICROSOFT_CALENDAR_CLIENT_SECRET
        </code>{" "}
        (optional{" "}
        <code className="rounded bg-muted px-1">
          MICROSOFT_CALENDAR_TENANT_ID
        </code>
        ). Siehe{" "}
        <code className="rounded bg-muted px-1">docs/MICROSOFT_CALENDAR_OAUTH.md</code>
        .
      </p>
    );
  }

  const disconnect = () => {
    startTransition(async () => {
      try {
        await disconnectMicrosoftCalendarAction();
        toast.success("Microsoft Kalender getrennt.");
      } catch {
        toast.error("Trennen fehlgeschlagen.");
      }
    });
  };

  const sync = () => {
    startTransition(async () => {
      try {
        const result = await syncMicrosoftCalendarAction();
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
          Outlook-Kalender per Microsoft Graph (Push, idempotent).
        </p>
        <Button variant="outline" size="sm" className="w-fit" asChild>
          <Link href="/api/integrations/microsoft/calendar/connect">
            Microsoft Kalender verbinden
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
