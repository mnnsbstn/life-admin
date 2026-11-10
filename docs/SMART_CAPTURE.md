# Smart Capture (SBSTN-64)

Paste invoice text, emails, or notes at **`/capture`** (also via **Quick Add → Smart Capture**). The app suggests pre-filled **Document**, **Contract**, or **Reminder** forms.

## Modes

| Mode | When |
|------|------|
| **Heuristic** | Default — no API key; rule-based dates, amounts, keywords (German/English) |
| **LLM** | `SMART_CAPTURE_API_KEY` set — OpenAI-compatible Chat Completions with JSON output; falls back to heuristic on errors |

## Environment (Vercel / server)

| Variable | Required | Example |
|----------|----------|---------|
| `SMART_CAPTURE_API_KEY` | For LLM | OpenAI API key |
| `SMART_CAPTURE_MODEL` | No | `gpt-4o-mini` (default) |
| `SMART_CAPTURE_API_URL` | No | `https://api.openai.com/v1` or compatible proxy |

## Flow

1. Open `/capture`, paste text, **Auswerten**
2. Choose **Als Dokument** / **Als Vertrag** / **Als Erinnerung**
3. Review on the create form and save

Prefill is passed via `sessionStorage` (single use per navigation).

## Limitations (V0.3)

- No PDF/image OCR yet — paste text only
- No automatic entity linking to home items/contracts
- GitHub Pages demo: capture is read-only (same as other writes)
