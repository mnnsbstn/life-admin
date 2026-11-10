"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface CalendarFeedSubscribeProps {
  httpsUrl: string;
  webcalUrl: string;
}

async function copyText(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}

export function CalendarFeedSubscribe({
  httpsUrl,
  webcalUrl,
}: CalendarFeedSubscribeProps) {
  const [copied, setCopied] = useState<"https" | "webcal" | null>(null);

  const onCopy = async (kind: "https" | "webcal") => {
    const value = kind === "webcal" ? webcalUrl : httpsUrl;
    await copyText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Persönlicher Abo-Link (nicht teilen). Kalender-Apps aktualisieren periodisch.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => onCopy("webcal")}
        >
          {copied === "webcal" ? (
            <Check className="size-4" />
          ) : (
            <Copy className="size-4" />
          )}
          webcal kopieren
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => onCopy("https")}
        >
          {copied === "https" ? (
            <Check className="size-4" />
          ) : (
            <Copy className="size-4" />
          )}
          HTTPS kopieren
        </Button>
      </div>
    </div>
  );
}
