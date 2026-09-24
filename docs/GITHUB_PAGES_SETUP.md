# GitHub Pages — einmalig aktivieren

Der Workflow **Deploy GitHub Pages** baut erfolgreich, kann aber **nicht deployen**, solange Pages im Repo nicht eingeschaltet ist (Fehler: `Failed to create deployment (status: 404)`).

## Schritte (ca. 1 Minute)

1. Öffne [github.com/mnnsbstn/life-admin/settings/pages](https://github.com/mnnsbstn/life-admin/settings/pages)
2. **Build and deployment → Source:** **GitHub Actions** wählen (nicht „Deploy from a branch“)
3. Speichern

## Deploy erneut starten

- **Actions** → **Deploy GitHub Pages** → **Run workflow** → Branch `main`  
  oder nach dem nächsten Push auf `main`

## Erwartete URL

[https://mnnsbstn.github.io/life-admin/](https://mnnsbstn.github.io/life-admin/)

Read-only Mock-Demo (kein Login, kein Supabase). Für die volle App siehe [DEPLOYMENT.md](./DEPLOYMENT.md) (z. B. Vercel).
