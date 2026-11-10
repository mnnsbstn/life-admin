# GitHub Pages CI and deploy

Life Admin ships a **read-only static demo** on GitHub Pages (`npm run build:gh-pages`). That build is stricter than the Vercel production build:

- Server routes and `proxy.ts` are removed during export prep
- `src/lib/actions` is replaced with **stubs** in `scripts/gh-pages-export/actions/`
- No `cookies()` at static prerender time (see `isStaticExportBuild()` guards)

## CI jobs

| Job | When | Purpose |
|-----|------|---------|
| `verify` | every PR + `main` | unit tests, lint, **production** `npm run build`, **stub check** |
| `e2e-mock` | every PR + `main` | Playwright smoke (mock backend) |
| `github-pages-export` | every PR + `main` | full static export build (catches stub/signature drift) |
| `production-smoke` | `main` only | live URLs + Pages health script |
| **Deploy GitHub Pages** | after **green CI on `main`** | uploads `out/` and publishes (no parallel failure if CI already failed) |

### Why deploy waits on CI

Previously, every push to `main` ran **CI** and **Deploy GitHub Pages** in parallel. If `github-pages-export` failed, you got **two failed workflows** (and extra notifications) for the same commit. Deploy now starts only when the **CI** workflow on `main` completes successfully (`workflow_run`).

Manual redeploy: **Actions → Deploy GitHub Pages → Run workflow**.

## Adding server actions

1. Add `src/lib/actions/<name>.ts`
2. Add `scripts/gh-pages-export/actions/<name>.ts` with the same exported functions (stubs throw or no-op; match return types)
3. Run `bash scripts/check-gh-pages-stubs.sh`

## Common failure messages

| Error | Typical fix |
|-------|-------------|
| `Module not found: @/lib/actions/...` | Missing stub file |
| `Property 'x' does not exist on type 'void'` | Stub return type does not match real action |
| `couldn't be rendered statically because it used cookies()` | Guard with `isStaticExportBuild()` or avoid cookies in static paths |

See also `scripts/prepare-gh-pages-export.sh` and `scripts/restore-gh-pages-export.sh`.
