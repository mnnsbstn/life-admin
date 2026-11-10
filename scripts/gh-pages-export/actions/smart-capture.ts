import type { SmartCaptureResult } from "@/lib/smart-capture/types";

async function blocked(): Promise<never> {
  throw new Error("Read-only GitHub Pages demo");
}

export async function parseSmartCaptureAction(
  _text: string,
): Promise<SmartCaptureResult> {
  return blocked();
}
