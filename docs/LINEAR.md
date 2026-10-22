# Linear — Life Admin

**Projekt:** [Life Admin](https://linear.app/mnnsbstn/project/life-admin-f1ba6d229b25) (Team `mnnsbstn`)

**V1-Ziel:** 5. Nov. 2026 — siehe [SBSTN-55](https://linear.app/mnnsbstn/issue/SBSTN-55/deploy-vercel-supabase-production-volle-app)

## Regel: Erledigtes immer in Linear

Jede abgeschlossene Aufgabe aus Entwicklung, Agent-Läufen oder PRs **muss** in Linear nachvollziehbar sein:

1. **Neue Arbeit:** Issue anlegen (oder bestehendes verwenden), Projekt **Life Admin**, sinnvoller Titel.
2. **Während der Arbeit:** Status **In Progress**.
3. **Fertig (gemergt / deployed / manuell erledigt):** Status **Done**, Beschreibung um **Was** + **Link** ergänzen (GitHub PR, Commit, Doku-Pfad).
4. **Kein stilles Abschließen** — wenn es kein passendes Issue gibt, kurz eines anlegen und sofort auf Done setzen.

### Titel-Konvention (Empfehlung)

`Bereich — Kurzbeschreibung`  
Beispiele: `V0.2 — …`, `Deploy — …`, `Docs — …`, `Fix — …`

### Agent / Cloud Runs

Am Ende eines Agent-Turns mit Code- oder Doku-Änderungen:

- Alle erledigten Teilaufgaben als **Done** markieren oder neue Done-Issues anlegen.
- Offene Follow-ups als **Todo** / **Backlog** mit Projekt verknüpfen.

Siehe auch `AGENTS.md` (Abschnitt Linear).
