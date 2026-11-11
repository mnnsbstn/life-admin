import { NextResponse } from "next/server";

import {
  isInboxWebhookConfigured,
  verifyInboxWebhookSecret,
} from "@/lib/inbox/webhook-auth";
import { parseSmartCaptureInput } from "@/lib/smart-capture/parse";

export async function POST(request: Request) {
  if (!isInboxWebhookConfigured()) {
    return NextResponse.json(
      { error: "inbox-webhook-unconfigured" },
      { status: 503 },
    );
  }

  const auth = request.headers.get("authorization");
  if (!verifyInboxWebhookSecret(auth)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let text = "";
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { text?: string; body?: string };
    text = (body.text ?? body.body ?? "").trim();
  } else {
    text = (await request.text()).trim();
  }

  if (text.length < 8) {
    return NextResponse.json({ error: "text-too-short" }, { status: 400 });
  }

  const result = await parseSmartCaptureInput(text);
  return NextResponse.json(result);
}
