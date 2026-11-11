# Inbox → Smart Capture Webhook

Forward email or automation payloads to Life Admin for **heuristic / LLM parsing** without using the UI.

## Endpoint

`POST /api/inbox/capture`

| Header | Value |
|--------|--------|
| `Authorization` | `Bearer <INBOX_WEBHOOK_SECRET>` |
| `Content-Type` | `application/json` or `text/plain` |

### JSON body

```json
{ "text": "Rechnung …\nBetrag 49,90 €" }
```

### Response

Same shape as `parseSmartCaptureAction` / Smart Capture UI (`SmartCaptureResult` JSON).

## Configuration

| Env | Purpose |
|-----|---------|
| `INBOX_WEBHOOK_SECRET` | Shared secret for Bearer auth |
| `SMART_CAPTURE_*` | Optional LLM (see `docs/SMART_CAPTURE.md`) |

## Integration ideas

- Zapier / Make: email trigger → HTTP POST with body
- Resend inbound (future): parse raw MIME → POST `text`

GitHub Pages static demo does not expose this route.
