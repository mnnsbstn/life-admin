## Summary

<!-- What changed and why (1–3 sentences) -->

## Testing

- [ ] `npm test`
- [ ] `npm run build` (Vercel path)
- [ ] `npm run e2e` (if UI/routing touched)

## GitHub Pages (static demo)

Skip if the PR does not touch `src/lib/actions/**`, app routes, or session/cookies.

- [ ] **New or renamed** `src/lib/actions/*.ts` → matching stub under `scripts/gh-pages-export/actions/`
- [ ] Stub **exports the same server actions** (signatures/types), especially **return types** Promise objects
- [ ] No new `cookies()` / dynamic APIs on paths that must static-export without a `GITHUB_PAGES=1` guard
- [ ] `bash scripts/check-gh-pages-stubs.sh` (also runs in CI)
- [ ] Optional local: `bash scripts/prepare-gh-pages-export.sh && npm run build:gh-pages && bash scripts/restore-gh-pages-export.sh`

Details: [docs/GITHUB_PAGES_CI.md](docs/GITHUB_PAGES_CI.md)

## Linear

<!-- Issue ID if applicable, e.g. SBSTN-59 -->
