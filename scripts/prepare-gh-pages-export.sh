#!/usr/bin/env bash
# Remove server-only entry points incompatible with `output: "export"`.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

remove_if_exists() {
  if [[ -f "$1" ]]; then
    rm "$1"
    echo "removed $1"
  fi
}

remove_if_exists "src/proxy.ts"
remove_if_exists "src/app/auth/callback/route.ts"
remove_if_exists "src/app/(app)/documents/[id]/download/route.ts"
remove_if_exists "src/app/api/health/supabase/route.ts"
remove_if_exists "src/app/api/calendar/[householdId]/[token]/route.ts"
remove_if_exists "src/app/api/integrations/google/calendar/connect/route.ts"
remove_if_exists "src/app/api/integrations/google/calendar/callback/route.ts"
remove_if_exists "src/app/api/inbox/capture/route.ts"

STUBS_DIR="$ROOT/scripts/gh-pages-export/actions"
ACTIONS_DIR="$ROOT/src/lib/actions"
BACKUP_DIR="$ROOT/.gh-pages-actions-backup"

if [[ -d "$ACTIONS_DIR" && ! -d "$BACKUP_DIR" ]]; then
  mv "$ACTIONS_DIR" "$BACKUP_DIR"
  cp -a "$STUBS_DIR" "$ACTIONS_DIR"
  echo "swapped src/lib/actions for GitHub Pages stubs"
fi
