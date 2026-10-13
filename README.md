# LOAD-ENCODE – Website

Quellcode der Website von LOAD-ENCODE, einer geplanten Forschungsinitiative zu
domänenspezifischer künstlicher Intelligenz und zur Modellierung von
Fahrzeugbelastungen. Die Website ist seit dem 13.10.2026 unter
https://load-encode.de veröffentlicht.

*Source code of the website of LOAD-ENCODE, a planned research initiative on
domain-specific AI and vehicle load modeling. The website has been published at
https://load-encode.de since 13 October 2026.*

## Stand

- Das Repository ist öffentlich. Alles, was hier liegt, einschließlich der
  Git-Historie, ist veröffentlicht.
- Veröffentlicht wird nur über den manuell gestarteten Workflow
  `deploy-pages.yml` nach Freigabe; siehe [docs/deployment.md](docs/deployment.md).
- Die Seiten in `site/` sind von der Projektleitung am 13.10.2026 freigegeben
  und tragen den Freigabestatus `released`.
- Eine öffentliche Förderung des Vorhabens ist nicht bewilligt.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `site/` | einziger Inhalt, der als Website ausgeliefert wird |
| `docs/` | Entwicklungs-, Deployment- und Inhaltsregeln |
| `scripts/` | Prüfskript und Git-Hook |
| `.github/` | Workflows, Pull-Request-Vorlage, Regelsatz-Definition |

## Schnellstart

```sh
# Inhalte prüfen
python scripts/check-public-content.py

# lokale Vorschau unter http://localhost:8000
python -m http.server 8000 --directory site
```

Details stehen in [docs/development.md](docs/development.md). Die verbindlichen
Regeln für alle Beiträge stehen in [AGENTS.md](AGENTS.md).

## Dokumentation

- [Architektur](docs/architecture.md)
- [Entwicklung](docs/development.md)
- [Deployment](docs/deployment.md)
- [Freigabe-Checkliste](docs/release-checklist.md)
- [DNS bei netcup](docs/dns-netcup.md)
- [GitHub-Einstellungen](docs/github-settings.md)
- [Inhaltsregeln](docs/content-policy.md)
- [Medien und Lizenzen](docs/assets-and-licenses.md)

## Lizenz

Für dieses Repository ist noch keine Lizenz vergeben. Bis zu einer Entscheidung
sind alle Rechte vorbehalten. Inhalte Dritter behalten ihre eigenen Lizenzen,
die in [docs/assets-and-licenses.md](docs/assets-and-licenses.md) verzeichnet
sind.
