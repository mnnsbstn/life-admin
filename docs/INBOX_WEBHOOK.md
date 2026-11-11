# Inbox → Smart Capture Webhook

Forward email or automation payloads to Life Admin for **heuristic / LLM parsing** without using the UI.

## Endpoint

`POST /api/inbox/capture`

| Header | Value |
|--------|--------|
| `Authorization` | `Bearer <INBOX_WEBHOOK_SECRET>` |
| `Content-Type` | `application/json` or `text/plain` |

### JSON body

Parse only:

```json
{ "text": "Rechnung …\nBetrag 49,90 €" }
```

Optional **auto-create** (same parse + persist to a household):

```json
{
  "text": "Rechnung …",
  "householdId": "<uuid>",
  "apply": true
}
```

| `apply` | Behaviour |
|---------|-----------|
| omitted / `false` | Parse only (default) |
| `true` or `"auto"` | Create reminder if due date found, else document, else contract |
| `"reminder"` / `"document"` / `"contract"` | Force target when parse produced that suggestion |

### Response

Parse-only: `SmartCaptureResult` JSON.

With `apply`: same fields plus `applied: { "kind": "reminder" \| "document" \| "contract", "id": "<uuid>" }`.

On failure after a successful parse, body includes `parse` and `error` (4xx/5xx).

## Configuration

| Env | Purpose |
|-----|---------|
| `INBOX_WEBHOOK_SECRET` | Shared secret for Bearer auth |
| `INBOX_WEBHOOK_HOUSEHOLD_ID` | Optional pin — only this household receives `apply`; omit `householdId` in JSON |
| `SUPABASE_SERVICE_ROLE_KEY` | Required for `apply` when `NEXT_PUBLIC_DATA_SOURCE=supabase` (RLS bypass) |
| `SMART_CAPTURE_*` | Optional LLM (see `docs/SMART_CAPTURE.md`) |

## Integration ideas

- Zapier / Make: email trigger → HTTP POST with body
- Resend inbound (future): parse raw MIME → POST `text`

GitHub Pages static demo does not expose this route.
