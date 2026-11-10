"use server";

import { parseSmartCaptureInput } from "@/lib/smart-capture/parse";
import type { SmartCaptureResult } from "@/lib/smart-capture/types";

export async function parseSmartCaptureAction(
  text: string,
): Promise<SmartCaptureResult> {
  return parseSmartCaptureInput(text);
}
