import { z } from "zod";

import type { SmartCaptureResult } from "@/lib/smart-capture/types";

const extractionSchema = z.object({
  summary: z.string(),
  document: z
    .object({
      title: z.string(),
      documentType: z.enum([
        "invoice",
        "contract",
        "manual",
        "warranty",
        "insurance",
        "certificate",
        "receipt",
        "other",
      ]),
      issuedAt: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  contract: z
    .object({
      name: z.string(),
      provider: z.string(),
      category: z.enum([
        "electricity",
        "internet",
        "mobile",
        "insurance",
        "streaming",
        "membership",
        "software",
        "other",
      ]),
      costEuro: z.string().optional(),
      paymentInterval: z
        .enum(["monthly", "quarterly", "yearly", "once", ""])
        .optional(),
      startDate: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  reminder: z
    .object({
      title: z.string(),
      dueDate: z.string(),
      priority: z.enum(["low", "medium", "high"]).optional(),
      notes: z.string().optional(),
    })
    .optional(),
});

export function isSmartCaptureLlmConfigured(): boolean {
  return Boolean(process.env.SMART_CAPTURE_API_KEY?.trim());
}

function apiBaseUrl(): string {
  return (
    process.env.SMART_CAPTURE_API_URL?.trim().replace(/\/$/, "") ??
    "https://api.openai.com/v1"
  );
}

function modelId(): string {
  return process.env.SMART_CAPTURE_MODEL?.trim() || "gpt-4o-mini";
}

export async function parseSmartCaptureWithLlm(
  text: string,
): Promise<SmartCaptureResult> {
  const response = await fetch(`${apiBaseUrl()}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SMART_CAPTURE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelId(),
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Du extrahierst Haushaltsdaten aus Text (Rechnungen, Verträge, Fristen). " +
            "Antworte nur mit JSON: summary (de), optional document, contract, reminder. " +
            "Daten als ISO-Datum YYYY-MM-DD. costEuro mit Komma (z.B. 49,90). " +
            "Felder weglassen wenn unbekannt.",
        },
        { role: "user", content: text.slice(0, 12_000) },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Smart Capture LLM error (${response.status}): ${body.slice(0, 200)}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Smart Capture LLM returned empty content");
  }

  const parsed = extractionSchema.parse(JSON.parse(content));

  return {
    source: "llm",
    summary: parsed.summary,
    document: parsed.document
      ? {
          title: parsed.document.title,
          documentType: parsed.document.documentType,
          issuedAt: parsed.document.issuedAt ?? "",
          mockFileName: "",
          linkType: "none",
          linkTargetId: "",
          notes: parsed.document.notes ?? "",
        }
      : undefined,
    contract: parsed.contract
      ? {
          name: parsed.contract.name,
          provider: parsed.contract.provider,
          category: parsed.contract.category,
          costEuro: parsed.contract.costEuro ?? "",
          paymentInterval: parsed.contract.paymentInterval ?? "",
          startDate: parsed.contract.startDate ?? "",
          minimumTermMonths: "",
          noticePeriodDays: "",
          nextCancellationDate: "",
          contractEndDate: "",
          autoRenewal: true,
          notes: parsed.contract.notes ?? "",
        }
      : undefined,
    reminder: parsed.reminder
      ? {
          title: parsed.reminder.title,
          dueDate: parsed.reminder.dueDate,
          priority: parsed.reminder.priority ?? "medium",
          linkType: "standalone",
          linkTargetId: "",
          notes: parsed.reminder.notes ?? "",
        }
      : undefined,
  };
}
