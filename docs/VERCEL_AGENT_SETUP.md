# Vercel agent setup (Cloud Agent / CLI)

Follows [vercel.com/get-started.md](https://vercel.com/get-started.md).

## CLI (this environment)

```bash
export PATH="${HOME}/.local/node_modules/.bin:${PATH}"
vercel --version   # 65.x when installed
vercel whoami
vercel login       # device flow — complete in browser
```

Install if missing:

```bash
npm install --prefix "${HOME}/.local" vercel@latest
```

## MCP (Cursor)

Global config: `~/.cursor/mcp.json` includes:

```json
{
  "mcpServers": {
    "vercel": {
      "url": "https://mcp.vercel.com"
    }
  }
}
```

In Cursor: open MCP → **Vercel** → **Needs login** → authorize OAuth.

After login, read-only check: `list_teams` (Vercel MCP).

## Deploy Life Admin (SBSTN-55)

1. `vercel login`
2. Export anon key from [Supabase life-admin](https://supabase.com/dashboard/project/oxnyvzsvrvnncorsgyjo/settings/api) (never commit).
3. From repo root:

```bash
export NEXT_PUBLIC_SUPABASE_ANON_KEY='your-anon-or-publishable-key'
./scripts/vercel-production-deploy.sh
```

4. Configure Supabase Auth redirect URLs with the printed `*.vercel.app` URL — [V1_PRODUCTION_SETUP.md](./V1_PRODUCTION_SETUP.md).

## Guidance plugin

The Vercel Cursor plugin (`npx plugins add vercel/vercel-plugin`) is not available in headless Cloud Agents; use this doc and [VERCEL_SUPABASE.md](./VERCEL_SUPABASE.md) instead.
