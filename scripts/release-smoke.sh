#!/usr/bin/env bash
# Automated release smoke checks (no auth). Run: npm run release:smoke
set -euo pipefail

PROD_URL="${LIFE_ADMIN_PROD_URL:-https://life-admin-sand-nu.vercel.app}"
GH_PAGES="${LIFE_ADMIN_GH_PAGES:-https://mnnsbstn.github.io/life-admin}"

pass=0
fail=0

check() {
  local name="$1"
  local url="$2"
  local expect="${3:-200}"
  local code
  code="$(curl -sS -o /dev/null -w '%{http_code}' "$url" || echo "000")"
  if [[ "$code" == "$expect" ]]; then
    echo "PASS  $name ($code) $url"
    pass=$((pass + 1))
  else
    echo "FAIL  $name (expected $expect, got $code) $url"
    fail=$((fail + 1))
  fi
}

echo "=== Life Admin release smoke ==="
echo "Production: $PROD_URL"
echo

check "login page" "$PROD_URL/login"
check "today redirects to login" "$PROD_URL/today" "307"
check "supabase health" "$PROD_URL/api/health/supabase"

health_json="$(curl -sS "$PROD_URL/api/health/supabase")"
if echo "$health_json" | grep -q '"ok":true'; then
  echo "PASS  supabase health payload ok=true"
  pass=$((pass + 1))
else
  echo "FAIL  supabase health payload: $health_json"
  fail=$((fail + 1))
fi

echo
echo "GitHub Pages: $GH_PAGES"
check "gh-pages root" "$GH_PAGES/"
# Static export serves /today as HTML (no server redirect)
check "gh-pages today" "$GH_PAGES/today/" "200"

echo
echo "=== Summary: $pass passed, $fail failed ==="
if [[ "$fail" -gt 0 ]]; then
  exit 1
fi

echo "Manual checks still required: register/login, CRUD, document upload — see docs/RELEASE_SMOKE_TEST.md"
