import { parseSmartCaptureHeuristic } from "@/lib/smart-capture/heuristic";
import {
  isSmartCaptureLlmConfigured,
  parseSmartCaptureWithLlm,
} from "@/lib/smart-capture/llm";
import type { SmartCaptureResult } from "@/lib/smart-capture/types";

export async function parseSmartCaptureInput(
  text: string,
): Promise<SmartCaptureResult> {
  const trimmed = text.trim();
  if (trimmed.length < 8) {
    throw new Error("Bitte mehr Text einfügen (mind. 8 Zeichen).");
  }

  if (isSmartCaptureLlmConfigured()) {
    try {
      return await parseSmartCaptureWithLlm(trimmed);
    } catch (error) {
      console.error("[life-admin] Smart Capture LLM failed, using heuristic", error);
    }
  }

  return parseSmartCaptureHeuristic(trimmed);
}

export function smartCaptureModeLabel(): "llm" | "heuristic" {
  return isSmartCaptureLlmConfigured() ? "llm" : "heuristic";
}
