#!/usr/bin/env bash
# Ensure every server action module has a GitHub Pages stub (prepare-gh-pages-export swaps these in).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REAL="$ROOT/src/lib/actions"
STUB="$ROOT/scripts/gh-pages-export/actions"

status=0

shopt -s nullglob
for f in "$REAL"/*.ts; do
  base=$(basename "$f")
  if [[ ! -f "$STUB/$base" ]]; then
    echo "Missing GH Pages stub: scripts/gh-pages-export/actions/$base (mirrors src/lib/actions/$base)"
    status=1
  fi
done

for f in "$STUB"/*.ts; do
  base=$(basename "$f")
  if [[ ! -f "$REAL/$base" ]]; then
    echo "Orphan GH Pages stub with no real action: scripts/gh-pages-export/actions/$base"
    status=1
  fi
done

if [[ $status -eq 0 ]]; then
  echo "GH Pages action stubs OK ($(ls -1 "$STUB"/*.ts | wc -l) files)"
fi

exit $status
