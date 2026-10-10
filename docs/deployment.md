# Deployment

## Grundsatz

Veröffentlicht wird ausschließlich der Inhalt von `site/`. Das Deployment
startet nie automatisch, sondern nur manuell nach Abarbeitung der
[Freigabe-Checkliste](release-checklist.md).

Derzeit ist kein Deployment möglich. GitHub Pages ist abgeschaltet, und alle
Seiten tragen den Status `draft`, an dem die Freigabeprüfung scheitert. Das
Repository selbst ist öffentlich: Die Beschränkung des Deployments auf `site/`
schützt die übrigen Dateien und die Git-Historie nicht. Was im Repository
liegt, ist veröffentlicht.

## Workflows

| Datei | Auslöser | Zweck |
| --- | --- | --- |
| `.github/workflows/validate.yml` | Pull Request, Push nach `main`, manuell | Prüfskript für Arbeitsstand und Historie; Freigabestatus als Hinweis |
| `.github/workflows/deploy-pages.yml` | nur manuell | Freigabeprüfung, Artefakt aus `site/`, Veröffentlichung |

Beide Workflows verwenden ausschließlich offizielle Actions von GitHub, gepinnt
auf vollständige Commit-SHAs (Stand 10.10.2026):

| Action | Version | Commit |
| --- | --- | --- |
| `actions/checkout` | v7.0.1 | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| `actions/configure-pages` | v6.0.0 | `45bfe0192ca1faeb007ade9deae92b16b8254a0d` |
| `actions/upload-pages-artifact` | v5.0.0 | `fc324d3547104276b827a68afc52ff2a11cc49c9` |
| `actions/deploy-pages` | v5.0.1 | `368f82528645a54fb793d4d04e342629a3f51346` |

Dependabot schlägt Aktualisierungen monatlich per Pull Request vor.

Das Prüfskript sichert diese Regeln bei jedem Lauf ab. Es meldet einen Fehler,
wenn eine Action nicht auf eine vollständige Commit-SHA gepinnt ist, wenn ein
anderer Workflow als `deploy-pages.yml` Pages-Actions verwendet, wenn
`deploy-pages.yml` einen anderen Auslöser als `workflow_dispatch` hat, wenn die
Freigabeprüfung fehlt oder wenn das Artefakt nicht aus `site/` gebaut wird.

## Sperren im Deployment-Workflow

Der Workflow bricht ab, wenn eine der folgenden Bedingungen nicht erfüllt ist:

1. Er wurde von `main` aus gestartet.
2. Die Repository-Variable `PAGES_RELEASE_APPROVED` steht auf `true`
   (Settings → Secrets and variables → Actions → Variables).
3. Das Eingabefeld enthält wörtlich `VEROEFFENTLICHEN`.
4. `python3 scripts/check-public-content.py --release --history` meldet keinen
   Fehler. Diese Prüfung scheitert an jeder Seite mit `release-status` `draft`,
   an jedem `data-placeholder`, an jedem `data-open` und an jedem Text
   `[OFFEN`.

Das Artefakt entsteht durch Kopieren von `site/` nach `_site/`; nur dieses
Verzeichnis wird hochgeladen. `upload-pages-artifact` lässt Dateien mit
führendem Punkt standardmäßig weg. Soll später `site/.well-known/` ausgeliefert
werden (etwa `security.txt`), braucht der Upload-Schritt
`include-hidden-files: true`.

Als fünfte Sperre verlangt die Umgebung `github-pages` die Freigabe des
Deployments durch eine benannte Person und lässt nur `main` zu (siehe
[github-settings.md](github-settings.md)). Ist GitHub Pages abgeschaltet,
scheitert der Workflow außerdem am Schritt „GitHub Pages konfigurieren“.

## GitHub Pages einschalten

Voraussetzung: Die Punkte „Einmalig vor der ersten Veröffentlichung“ der
Checkliste sind erledigt.

1. Domain verifizieren, bevor sie irgendwo eingetragen wird
   ([dns-netcup.md](dns-netcup.md), Schritt 2).
2. Settings → Pages → „Build and deployment“ → Source: **GitHub Actions**.
   Per CLI:
   `gh api -X POST repos/<eigentümer>/load-encode-website/pages -f build_type=workflow`
3. Settings → Environments → `github-pages` prüfen: Bereitstellung nur von
   `main`, Freigabe durch eine benannte Person. Beides ist seit 10.10.2026
   gesetzt; nach einer Übertragung des Repositorys muss es neu eingerichtet
   werden.
4. Custom Domain `load-encode.de` in den Pages-Einstellungen eintragen. Eine
   Datei `CNAME` im Repository ist beim Deployment über Actions weder nötig noch
   wirksam.
5. DNS bei netcup setzen ([dns-netcup.md](dns-netcup.md), Schritte 4 bis 6).
6. Erstes Deployment wie unten beschrieben.
7. „Enforce HTTPS“ aktivieren, sobald GitHub das Zertifikat ausgestellt hat.

## Ablauf eines Deployments

1. Pull Request mit allen Seiten auf `released` vorbereiten und gemäß
   Checkliste prüfen.
2. Pull Request genehmigen und nach `main` zusammenführen.
3. `PAGES_RELEASE_APPROVED` auf `true` setzen:
   `gh variable set PAGES_RELEASE_APPROVED --body true --repo <eigentümer>/load-encode-website`
4. Workflow starten:
   `gh workflow run deploy-pages.yml --ref main -f bestaetigung=VEROEFFENTLICHEN --repo <eigentümer>/load-encode-website`
5. Ergebnis unter `https://load-encode.de/` prüfen.
6. `PAGES_RELEASE_APPROVED` wieder auf `false` setzen.

## Zurücknehmen

- Fehlerhafter Inhalt: Den letzten freigegebenen Stand von `main`
  wiederherstellen (Revert-Pull-Request) und erneut deployen.
- Website sofort offline nehmen: Settings → Pages → „Unpublish site“ oder
  `gh api -X DELETE repos/<eigentümer>/load-encode-website/pages`. Danach die
  DNS-Einträge für GitHub Pages bei netcup entfernen, weil eine eigene Domain,
  die auf eine abgeschaltete Pages-Seite zeigt, von Dritten übernommen werden
  könnte.
- Ein Rückzug entfernt nichts aus Suchmaschinen-Caches, Web-Archiven oder
  Kopien Dritter. Was nicht veröffentlicht werden darf, wird vorher geprüft.

## Nutzungsbedingungen von GitHub Pages

GitHub Pages ist nach den Bedingungen von GitHub nicht als kostenloser
Webhoster für Websites gedacht, deren Hauptzweck kommerzielle Transaktionen
sind. Ob eine Projektpräsentation einer Hochschule mit Partnerakquise darunter
fällt, ist vor der ersten Veröffentlichung zu entscheiden und zu dokumentieren
(Checkliste, erster Abschnitt). Die Wahl von GitHub für den Quellcode hängt
davon nicht ab; ein Wechsel des Hostings betrifft nur den Deployment-Workflow.

## Verlauf

Am 10.10.2026 wurde das Repository öffentlich geschaltet und GitHub Pages
eingeschaltet. Mit dem ersten Pull Request kam der Vorlage-Workflow
`static.yml` hinzu. Er veröffentlichte bei jedem Push auf `main` das gesamte
Repository ohne Freigabeprüfung, und ein Durchlauf war erfolgreich. Damit
waren die Entwurfsseiten unter `https://pdoeble.github.io/load-encode-website/`
einige Stunden erreichbar.

Noch am selben Tag wurde `static.yml` deaktiviert, GitHub Pages abgeschaltet
und der Workflow durch `deploy-pages.yml` ersetzt. Die ausgelieferten Dateien
waren dieselben, die im öffentlichen Repository ohnehin lesbar sind; vertrauliche
Inhalte enthielt das Repository nach der Prüfung mit
`scripts/check-public-content.py --history` nicht.
