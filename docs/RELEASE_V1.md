# V1.0.0 — Release-Ablauf

Parent: [SBSTN-97](https://linear.app/mnnsbstn/issue/SBSTN-97) · Smoke: [SBSTN-99](https://linear.app/mnnsbstn/issue/SBSTN-99)

## Vor dem Tag (Pflicht)

1. **[SBSTN-101](https://linear.app/mnnsbstn/issue/SBSTN-101)** — Supabase [Confirm email aus](https://supabase.com/dashboard/project/oxnyvzsvrvnncorsgyjo/auth/providers?provider=Email)
2. Bei Rate-Limit-Fehlern beim Testen: **15 Min. warten** oder Testuser im Supabase-Dashboard manuell bestätigen
3. **Manueller Smoke** laut [RELEASE_SMOKE_TEST.md](./RELEASE_SMOKE_TEST.md) → SBSTN-99 auf **Done**

## Version & Tag (nach grünem Smoke)

Auf `main` (Version und `CHANGELOG.md` sollten bereits gemergt sein):

```bash
git pull origin main
npm run release:smoke
git tag -a v1.0.0 -m "Life Admin v1.0.0 — Vercel + Supabase V1"
git push origin v1.0.0
```

## GitHub Release

1. [Releases → Draft new](https://github.com/mnnsbstn/life-admin/releases/new)
2. Tag: `v1.0.0`
3. Title: `Life Admin v1.0.0`
4. Body: Abschnitt **1.0.0** aus `CHANGELOG.md`
5. Links: Production `https://life-admin-sand-nu.vercel.app` · Demo Pages `https://mnnsbstn.github.io/life-admin/`

## Linear

- SBSTN-100 → Done (PR + Release-URL)
- SBSTN-97 → Done (V1 Sign-off)
