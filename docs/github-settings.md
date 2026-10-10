# GitHub-Einstellungen

Stand: 10.10.2026. Die Einstellungen wurden per GitHub-CLI und REST-API gesetzt
und anschließend abgefragt.

## Eigentümerschaft

Das Repository liegt vorläufig im persönlichen Konto `pdoeble`. Eine
verifizierte GitHub-Organisation der Hochschule war nicht auffindbar, und das
Konto ist in keiner Organisation Mitglied. Vorgesehen ist die Übertragung an
eine institutionell verwaltete Organisation, sobald diese geklärt ist.

Bei einer Übertragung bleiben Historie, Issues und Pull Requests erhalten, und
GitHub leitet die alte Adresse weiter. Neu einzurichten sind dann die
Domainverifizierung für GitHub Pages in der Organisation, die Pages-Einstellung
der eigenen Domain und die Zugriffsrechte.

## Gesetzte Einstellungen

| Einstellung | Wert | Stand |
| --- | --- | --- |
| Sichtbarkeit | privat | gesetzt |
| Standardbranch | `main` | gesetzt |
| Wiki | aus | gesetzt |
| Issues | aus | gesetzt; Diskussionen über Partner gehören nicht in öffentliche Issues |
| Discussions | aus | gesetzt |
| Projects | aus | gesetzt |
| Merge-Methoden | nur Squash-Merge (Titel und Text aus dem Pull Request) | gesetzt |
| Branch nach Merge löschen | an | gesetzt |
| Actions | nur von GitHub bereitgestellte Actions | gesetzt |
| Actions nur mit vollständiger Commit-SHA | Pflicht (`sha_pinning_required`) | gesetzt |
| Standardrechte des Workflow-Tokens | nur lesen; keine Freigabe von Pull Requests durch Actions | gesetzt |
| Dependabot-Sicherheitswarnungen | an | gesetzt |
| Lizenz | keine | bewusst offen |

## Im kostenlosen Tarif für private Repositories nicht verfügbar

Die folgenden Einstellungen lehnte GitHub für das private Repository ab. Sie
werden beim Öffentlichschalten gesetzt.

| Funktion | Rückmeldung von GitHub |
| --- | --- |
| Regelsatz für `main` (Löschschutz, kein Force-Push, Pull Request, Statusprüfung) | „Upgrade to GitHub Pro or make this repository public to enable this feature.“ |
| klassischer Branch-Schutz | dieselbe Meldung |
| Secret Scanning und Push Protection | „Secret scanning is not available for this repository.“ |
| private Meldung von Sicherheitslücken | nur für öffentliche Repositories |
| GitHub Pages | im kostenlosen Tarif nur für öffentliche Repositories |

Bis dahin ersetzen das Prüfskript, der Pre-Push-Hook und die Arbeitsregel
„nur über Pull Requests nach `main`“ diese Schutzfunktionen teilweise.

## Beim Öffentlichschalten

Erst nach der Checkliste in [release-checklist.md](release-checklist.md),
Abschnitt „Einmalig vor der ersten Veröffentlichung“. Dann, mit
`GH_HOST=github.com` und `R=repos/<eigentümer>/load-encode-website`:

```sh
# Sichtbarkeit
gh repo edit <eigentümer>/load-encode-website --visibility public --accept-visibility-change-consequences

# Secret Scanning und Push Protection
gh api -X PATCH $R --input - <<'EOF'
{"security_and_analysis":{"secret_scanning":{"status":"enabled"},"secret_scanning_push_protection":{"status":"enabled"}}}
EOF

# private Meldung von Sicherheitslücken
gh api -X PUT $R/private-vulnerability-reporting

# Regelsatz für main
gh api -X POST $R/rulesets --input .github/rulesets/main-protection.json
```

Danach in den Einstellungen unter „Environments“ für `github-pages` die
Freigabe durch eine benannte Person („Required reviewers“) aktivieren und den
Bereitstellungszweig auf `main` beschränken.

Der Regelsatz verlangt Pull Requests und die bestandene Prüfung „Inhalte und
Struktur prüfen“. Die Zahl der Pflicht-Reviews steht auf null, solange nur eine
Person Zugriff hat. Sobald eine zweite Person Administratorrechte hat, wird sie
auf eins gesetzt.

## Zugangsdaten für Pushes

Wer Dateien unter `.github/workflows/` pusht, braucht ein Token mit dem Scope
`workflow`. Für die GitHub-CLI lässt er sich mit
`gh auth refresh -h github.com -s workflow` ergänzen; der Befehl öffnet eine
Anmeldung im Browser.

## Zugriff

Derzeit hat nur der Eigentümer Zugriff. Vorgesehen sind mindestens zwei
Personen mit Administratorrechten, damit der Betrieb nicht an einer Person
hängt. Weitere Mitwirkende erhalten Schreibrechte, keine Administratorrechte.
