# Sicherheit

## Geltungsbereich

Die Website ist statisch. Sie hat kein Backend, keine Datenbank, keine
Benutzerkonten und keine Formulare. Ausgeliefert wird nur der Inhalt von
`site/` über GitHub Pages.

## Sicherheitslücken melden

Bitte melden Sie Sicherheitsprobleme nicht über öffentliche Issues oder Pull
Requests. Sobald das Repository öffentlich ist, ist die private Meldefunktion
von GitHub aktiviert (Reiter „Security“, Schaltfläche „Report a
vulnerability“). Eine institutionelle Kontaktadresse für Sicherheitsmeldungen
wird ergänzt, sobald sie feststeht.

## Versehentlich veröffentlichte Informationen

Wer feststellt, dass vertrauliche Informationen oder Zugangsdaten in diesem
Repository stehen, meldet das bitte ebenfalls über den privaten Meldeweg. Das
Team geht nach dem Verfahren in
[docs/content-policy.md](docs/content-policy.md#versehentliche-veröffentlichung)
vor: Zugangsdaten werden sofort ungültig gemacht, die Historie wird bereinigt
und betroffene Stellen werden informiert.

## Vorbeugende Maßnahmen

- Das Prüfskript `scripts/check-public-content.py` sucht vor jedem Commit und in
  jeder Pull-Request-Prüfung nach Zugangsdaten, lokalen Pfaden, internen
  Kennungen, nicht zulässigen Dateitypen und externen Ressourcen.
- Workflows laufen mit minimalen Rechten; nur von GitHub selbst
  bereitgestellte Actions sind zugelassen, und sie sind auf feste
  Commit-Stände gepinnt.
- Secret Scanning und Push Protection werden aktiviert, sobald das Repository
  öffentlich ist (siehe [docs/github-settings.md](docs/github-settings.md)).
