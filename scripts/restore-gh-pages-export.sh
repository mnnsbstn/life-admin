#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

git checkout -- src/middleware.ts \
  src/app/auth/callback/route.ts \
  "src/app/(app)/documents/[id]/download/route.ts" 2>/dev/null || true

BACKUP_DIR="$ROOT/.gh-pages-actions-backup"
ACTIONS_DIR="$ROOT/src/lib/actions"

if [[ -d "$BACKUP_DIR" ]]; then
  rm -rf "$ACTIONS_DIR"
  mv "$BACKUP_DIR" "$ACTIONS_DIR"
  echo "restored src/lib/actions from backup"
fi
