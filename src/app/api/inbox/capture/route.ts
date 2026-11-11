import { NextResponse } from "next/server";

import {
  isInboxWebhookConfigured,
  verifyInboxWebhookSecret,
} from "@/lib/inbox/webhook-auth";
import { resolveInboxWebhookHouseholdId } from "@/lib/inbox/webhook-household";
import {
  applySmartCaptureToHousehold,
  type SmartCaptureApplyMode,
} from "@/lib/smart-capture/apply";
import { parseSmartCaptureInput } from "@/lib/smart-capture/parse";

type InboxCaptureBody = {
  text?: string;
  body?: string;
  householdId?: string;
  apply?: SmartCaptureApplyMode;
};

function wantsApply(apply: SmartCaptureApplyMode | undefined): apply is SmartCaptureApplyMode {
  return apply === true || apply === "auto" || apply === "reminder" || apply === "document" || apply === "contract";
}

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
  let householdIdInput: string | undefined;
  let applyMode: SmartCaptureApplyMode | undefined;

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as InboxCaptureBody;
    text = (body.text ?? body.body ?? "").trim();
    householdIdInput = body.householdId;
    applyMode = body.apply;
  } else {
    text = (await request.text()).trim();
  }

  if (text.length < 8) {
    return NextResponse.json({ error: "text-too-short" }, { status: 400 });
  }

  const result = await parseSmartCaptureInput(text);

  if (!wantsApply(applyMode)) {
    return NextResponse.json(result);
  }

  const householdResolved = resolveInboxWebhookHouseholdId(householdIdInput);
  if ("error" in householdResolved) {
    return NextResponse.json(
      { error: householdResolved.error, parse: result },
      { status: householdResolved.status },
    );
  }

  try {
    const applied = await applySmartCaptureToHousehold(
      householdResolved.householdId,
      result,
      applyMode === true ? "auto" : applyMode,
    );
    return NextResponse.json({ ...result, applied });
  } catch (err) {
    const message = err instanceof Error ? err.message : "apply-failed";
    const status =
      message === "no-apply-target"
        ? 422
        : message === "household-not-found"
          ? 404
          : message === "service-role-required"
            ? 503
            : 500;
    return NextResponse.json({ error: message, parse: result }, { status });
  }
}
