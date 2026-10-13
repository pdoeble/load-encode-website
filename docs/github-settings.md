# GitHub-Einstellungen

Stand: 10.10.2026, abends. Die Werte wurden über die REST-API gesetzt oder
abgefragt.

## Eigentümerschaft

Das Repository liegt vorläufig im persönlichen Konto `pdoeble`. Eine
verifizierte GitHub-Organisation der Hochschule war nicht auffindbar, und das
Konto ist in keiner Organisation Mitglied. Vorgesehen ist die Übertragung an
eine institutionell verwaltete Organisation der Hochschule Esslingen, sobald
diese geklärt ist.

Bei einer Übertragung bleiben Historie, Issues und Pull Requests erhalten, und
GitHub leitet die alte Adresse weiter. Neu einzurichten sind dann die
Domainverifizierung für GitHub Pages in der Organisation, die Pages-Einstellung
der eigenen Domain, die Umgebung `github-pages` und die Zugriffsrechte.

## Repository

| Einstellung | Wert |
| --- | --- |
| Sichtbarkeit | öffentlich |
| Standardbranch | `main` |
| Wiki, Issues, Projects | aus |
| Merge-Methoden | nur Squash-Merge |
| Auto-Merge | aus |
| Aktualisierung von PR-Branches vorschlagen | an |
| Branch nach Merge löschen | an |
| Lizenz | keine, bewusst offen |

Issues sind abgeschaltet, weil Gespräche über mögliche Partner nicht in ein
öffentliches Repository gehören.

## Regelsatz `protect-main`

Der Regelsatz gilt nur für den Standardbranch (`~DEFAULT_BRANCH`). Feature-
Branches sind frei, damit dort ohne Pull Request gearbeitet werden kann.

| Regel | Wert |
| --- | --- |
| Löschen | verboten |
| Force-Push | verboten |
| lineare Historie | Pflicht |
| Pull Request | Pflicht, null Pflicht-Reviews, offene Diskussionen müssen gelöst sein |
| Statusprüfung | „Inhalte und Struktur prüfen“ aus `validate.yml` |
| Ausnahmen | keine |

Die Definition liegt in
[`.github/rulesets/main-protection.json`](../.github/rulesets/main-protection.json)
und entspricht dem aktiven Regelsatz. Die Zahl der Pflicht-Reviews steht auf
null, solange nur eine Person Zugriff hat. Sobald eine zweite berechtigte
Person verfügbar ist, wird sie auf eins gesetzt:

```sh
gh api repos/pdoeble/load-encode-website/rulesets/<id> > ruleset.json
# in ruleset.json required_approving_review_count auf 1 setzen, dann:
gh api -X PUT repos/pdoeble/load-encode-website/rulesets/<id> --input ruleset.json
```

Die Kennung des Regelsatzes liefert `gh api repos/pdoeble/load-encode-website/rulesets`.

## Actions

| Einstellung | Wert |
| --- | --- |
| erlaubte Actions | nur von GitHub bereitgestellte |
| Actions nur mit vollständiger Commit-SHA | Pflicht (`sha_pinning_required`) |
| Standardrechte des Workflow-Tokens | nur lesen |
| Freigabe von Pull Requests durch Actions | aus |
| Workflows | `validate.yml` (automatisch), `deploy-pages.yml` (nur manuell) |

Der Workflow `static.yml` aus dem ersten Pull Request veröffentlichte bei jedem
Push auf `main` das gesamte Repository. Er wurde am 10.10.2026 deaktiviert und
durch `deploy-pages.yml` ersetzt; siehe [deployment.md](deployment.md),
Abschnitt „Verlauf“.

## Sicherheit

| Funktion | Wert |
| --- | --- |
| Secret Scanning | an |
| Push Protection | an |
| Dependabot-Sicherheitswarnungen und -Updates | an |
| Dependabot-Versionsupdates | monatlich für GitHub Actions |
| private Meldung von Sicherheitslücken | an |

## GitHub Pages

| Einstellung | Wert |
| --- | --- |
| Pages | eingeschaltet seit 13.10.2026 |
| Quelle | GitHub Actions |
| eigene Domain | `load-encode.de`, eingetragen am 13.10.2026 |
| Umgebung `github-pages` | Bereitstellung nur von `main`, Freigabe durch `pdoeble` |

Ablauf einer Veröffentlichung und Rücknahme: [deployment.md](deployment.md).

## Zugangsdaten für Pushes

Wer Dateien unter `.github/workflows/` pusht, braucht ein Token mit dem Scope
`workflow`. Für die GitHub-CLI lässt er sich mit
`gh auth refresh -h github.com -s workflow` ergänzen; der Befehl öffnet eine
Anmeldung im Browser.

## Zugriff

Derzeit hat nur der Eigentümer Zugriff. Vorgesehen sind mindestens zwei
Personen mit Administratorrechten, damit der Betrieb nicht an einer Person
hängt. Weitere Mitwirkende erhalten Schreibrechte, keine Administratorrechte.
