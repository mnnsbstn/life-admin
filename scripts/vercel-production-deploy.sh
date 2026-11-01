#!/usr/bin/env bash
# Link mnnsbstn/life-admin on Vercel and deploy Production with Supabase env vars.
# Requires: vercel login (or VERCEL_TOKEN), Supabase keys in env or as arguments.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export PATH="${HOME}/.local/node_modules/.bin:${PATH}"

if ! command -v vercel >/dev/null 2>&1; then
  echo "Installing Vercel CLI to ~/.local …"
  npm install --prefix "${HOME}/.local" vercel@latest
fi

if ! vercel whoami >/dev/null 2>&1; then
  echo "Not logged in. Run: vercel login"
  echo "Or set VERCEL_TOKEN for non-interactive use."
  exit 1
fi

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://oxnyvzsvrvnncorsgyjo.supabase.co}"
SUPABASE_ANON="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}"

if [[ -z "${SUPABASE_ANON}" ]]; then
  echo "Set NEXT_PUBLIC_SUPABASE_ANON_KEY (Supabase Dashboard → Project life-admin → Settings → API)."
  exit 1
fi

if [[ ! -f .vercel/project.json ]]; then
  echo "Linking Vercel project (confirm prompts if needed) …"
  vercel link --yes 2>/dev/null || vercel link
fi

set_env() {
  local name="$1"
  local value="$2"
  if vercel env ls production 2>/dev/null | grep -q "^ ${name} "; then
    echo "Env ${name} already set on Production (skip)."
  else
    printf '%s' "$value" | vercel env add "$name" production
  fi
}

set_env NEXT_PUBLIC_DATA_SOURCE supabase
set_env NEXT_PUBLIC_SUPABASE_URL "$SUPABASE_URL"
set_env NEXT_PUBLIC_SUPABASE_ANON_KEY "$SUPABASE_ANON"

echo "Deploying to Production …"
vercel deploy --prod

echo ""
echo "Next: Supabase → Authentication → URL configuration"
echo "  Site URL + Redirect URL: https://YOUR-DEPLOYMENT/auth/callback"
echo "See docs/V1_PRODUCTION_SETUP.md"
