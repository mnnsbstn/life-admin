import type { ContractFormValues } from "@/features/contracts/schemas/contract.schema";
import type { DocumentFormValues } from "@/features/documents/schemas/document.schema";
import type { SmartCaptureResult } from "@/lib/smart-capture/types";

const DATE_DE = /\b(\d{1,2})[./](\d{1,2})[./](\d{2,4})\b/g;
const MONEY_EURO =
  /(?:€\s*|EUR\s*)(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*€/gi;

function parseGermanDate(match: string): string | undefined {
  const m = match.match(/^(\d{1,2})[./](\d{1,2})[./](\d{2,4})$/);
  if (!m) return undefined;
  let year = Number(m[3]);
  if (year < 100) year += 2000;
  const month = m[2].padStart(2, "0");
  const day = m[1].padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function extractDates(text: string): string[] {
  const dates: string[] = [];
  for (const match of text.matchAll(DATE_DE)) {
    const iso = parseGermanDate(match[0]);
    if (iso) dates.push(iso);
  }
  return dates;
}

function extractEuroAmount(text: string): string | undefined {
  const m = MONEY_EURO.exec(text);
  MONEY_EURO.lastIndex = 0;
  if (!m) return undefined;
  const raw = (m[1] ?? m[2] ?? "").replace(/\./g, "").replace(",", ".");
  const num = Number.parseFloat(raw);
  if (Number.isNaN(num)) return undefined;
  return num.toFixed(2).replace(".", ",");
}

function inferDocumentType(text: string): DocumentFormValues["documentType"] {
  const lower = text.toLowerCase();
  if (lower.includes("rechnung") || lower.includes("invoice")) return "invoice";
  if (lower.includes("quittung") || lower.includes("receipt")) return "receipt";
  if (lower.includes("garantie") || lower.includes("warranty")) return "warranty";
  if (lower.includes("versicherung") || lower.includes("police")) return "insurance";
  if (lower.includes("vertrag") && !lower.includes("mietvertrag")) return "contract";
  if (lower.includes("handbuch") || lower.includes("manual")) return "manual";
  if (lower.includes("zertifikat") || lower.includes("certificate")) return "certificate";
  return "other";
}

function firstMeaningfulLine(text: string): string {
  const line =
    text
      .split(/\n/)
      .map((l) => l.trim())
      .find((l) => l.length > 3) ?? "Eingang erfasst";
  return line.slice(0, 120);
}

function inferContractCategory(text: string): ContractFormValues["category"] {
  const lower = text.toLowerCase();
  if (lower.includes("strom") || lower.includes("electric")) return "electricity";
  if (lower.includes("internet") || lower.includes("dsl")) return "internet";
  if (lower.includes("handy") || lower.includes("mobil")) return "mobile";
  if (lower.includes("versicherung") || lower.includes("insurance")) return "insurance";
  if (lower.includes("netflix") || lower.includes("streaming")) return "streaming";
  if (lower.includes("fitness") || lower.includes("membership")) return "membership";
  if (lower.includes("software") || lower.includes("saas")) return "software";
  return "other";
}

/** Rule-based extraction when no LLM API key is configured. */
export function parseSmartCaptureHeuristic(text: string): SmartCaptureResult {
  const trimmed = text.trim();
  const dates = extractDates(trimmed);
  const issuedAt = dates[0];
  const dueDate = dates[1] ?? dates[0];
  const costEuro = extractEuroAmount(trimmed);
  const title = firstMeaningfulLine(trimmed);
  const docType = inferDocumentType(trimmed);

  const looksLikeContract =
    /vertrag|kündigung|tarif|abo|subscription|monatlich|jährlich/i.test(trimmed);

  const result: SmartCaptureResult = {
    source: "heuristic",
    summary: `Erkannt: ${docType === "invoice" ? "Rechnung" : "Text"} — bitte Vorschläge prüfen.`,
    document: {
      title,
      documentType: docType,
      issuedAt: issuedAt ?? "",
      mockFileName: "",
      linkType: "none",
      linkTargetId: "",
      notes: trimmed.length > 400 ? `${trimmed.slice(0, 400)}…` : trimmed,
    },
  };

  if (looksLikeContract) {
    const providerGuess =
      trimmed.match(/(?:von|from)\s+([^\n,]{3,40})/i)?.[1]?.trim() ?? "";
    result.contract = {
      name: title.slice(0, 80),
      provider: providerGuess || "Anbieter",
      category: inferContractCategory(trimmed),
      costEuro: costEuro ?? "",
      paymentInterval: /monatlich|monthly/i.test(trimmed) ? "monthly" : "",
      startDate: issuedAt ?? "",
      minimumTermMonths: "",
      noticePeriodDays: "",
      nextCancellationDate: "",
      contractEndDate: "",
      autoRenewal: true,
      notes: trimmed.length > 300 ? `${trimmed.slice(0, 300)}…` : trimmed,
    };
    result.summary =
      "Erkannt: möglicher Vertrag und Dokument — Vorschläge prüfen.";
  }

  if (dueDate) {
    result.reminder = {
      title: `Frist: ${title.slice(0, 60)}`,
      dueDate,
      priority: /dringend|wichtig|sofort/i.test(trimmed) ? "high" : "medium",
      linkType: "standalone",
      linkTargetId: "",
      notes: "Aus Smart Capture übernommen.",
    };
  }

  return result;
}
