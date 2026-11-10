"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileSignature, FileText, Bell, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { parseSmartCaptureAction } from "@/lib/actions/smart-capture";
import {
  readSmartCapturePrefill,
  writeSmartCapturePrefill,
} from "@/lib/smart-capture/prefill-session";
import {
  SMART_CAPTURE_SESSION_KEYS,
  type SmartCaptureResult,
} from "@/lib/smart-capture/types";

interface SmartCaptureViewProps {
  mode: "llm" | "heuristic";
}

export function SmartCaptureView({ mode }: SmartCaptureViewProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [result, setResult] = useState<SmartCaptureResult | null>(null);
  const [pending, startTransition] = useTransition();

  const runParse = () => {
    startTransition(async () => {
      try {
        const parsed = await parseSmartCaptureAction(text);
        setResult(parsed);
      } catch {
        toast.error("Text konnte nicht ausgewertet werden.");
      }
    });
  };

  const applyPrefill = (target: "document" | "contract" | "reminder") => {
    if (!result) return;
    const partial = result[target];
    if (!partial) return;

    const key = SMART_CAPTURE_SESSION_KEYS[target];
    writeSmartCapturePrefill(key, partial);

    const href =
      target === "document"
        ? "/documents/new"
        : target === "contract"
          ? "/contracts/new"
          : "/reminders/new";
    router.push(href);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sparkles className="size-5" />
          <span className="text-xs font-medium uppercase tracking-wider">
            Smart Capture
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Text oder Rechnung einfügen
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "llm"
            ? "KI extrahiert Vorschläge für Dokument, Vertrag oder Erinnerung."
            : "Regelbasierte Erkennung (ohne API-Key) — für KI optional SMART_CAPTURE_API_KEY setzen."}
        </p>
      </header>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          "Rechnung Vodafone\nRechnungsdatum: 05.11.2026\nBetrag: 49,90 €\n..."
        }
        rows={10}
        className="font-mono text-sm"
        disabled={pending}
      />

      <Button type="button" onClick={runParse} disabled={pending || text.trim().length < 8}>
        {pending ? "Wird ausgewertet…" : "Auswerten"}
      </Button>

      {result ? (
        <section className="space-y-4 rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">{result.summary}</p>
          <p className="text-xs text-muted-foreground">
            Quelle: {result.source === "llm" ? "KI" : "Heuristik"}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {result.document ? (
              <Button
                type="button"
                variant="secondary"
                className="justify-start gap-2"
                onClick={() => applyPrefill("document")}
              >
                <FileText className="size-4" />
                Als Dokument
              </Button>
            ) : null}
            {result.contract ? (
              <Button
                type="button"
                variant="secondary"
                className="justify-start gap-2"
                onClick={() => applyPrefill("contract")}
              >
                <FileSignature className="size-4" />
                Als Vertrag
              </Button>
            ) : null}
            {result.reminder ? (
              <Button
                type="button"
                variant="secondary"
                className="justify-start gap-2"
                onClick={() => applyPrefill("reminder")}
              >
                <Bell className="size-4" />
                Als Erinnerung
              </Button>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
