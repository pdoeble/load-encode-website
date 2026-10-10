# Freigabe-Checkliste

Diese Liste wird vor jedem Deployment vollständig abgearbeitet. Die
verantwortliche Person bestätigt das Ergebnis im Pull Request, der den Status
der Seiten auf `released` setzt. Kein Punkt wird übersprungen, weil ein
automatischer Test grün ist.

## Einmalig vor der ersten Veröffentlichung

- [ ] Die Hochschule hat geklärt, wer die Website betreibt und verantwortet.
- [ ] Das Repository gehört einem institutionell verwalteten Konto oder einer
      Organisation, und mindestens zwei berechtigte Personen haben
      Administratorrechte.
- [ ] Die Nutzung von GitHub Pages ist mit den Nutzungsbedingungen von GitHub
      und den Vorgaben der Hochschule vereinbar (dokumentierte Entscheidung).
- [ ] Impressum, Datenschutzerklärung und Erklärung zur Barrierefreiheit sind
      vollständig und von den zuständigen Stellen freigegeben.
- [ ] Der Datenschutzbeauftragte hat das Hosting und die Datenschutzerklärung
      geprüft.
- [ ] Die institutionelle Kontaktadresse existiert und wird gelesen.
- [ ] Die gesamte Git-Historie ist mit
      `python scripts/check-public-content.py --history --release` und der
      aktuellen Begriffsliste fehlerfrei.
- [ ] Eine zweite Person hat die Historie stichprobenartig gesichtet,
      insbesondere Commit-Nachrichten und gelöschte Dateien.
- [ ] Erst danach wird das Repository öffentlich geschaltet und die
      Einstellungen aus [github-settings.md](github-settings.md), Abschnitt
      „Beim Öffentlichschalten“, werden gesetzt.
- [ ] Die Domain ist bei GitHub verifiziert, bevor DNS-Einträge auf GitHub
      Pages zeigen ([dns-netcup.md](dns-netcup.md)).

## Vor jedem Deployment

### Inhalt

- [ ] Jede fachliche Aussage hat eine Quelle oder eine dokumentierte Freigabe.
- [ ] Geplantes ist als geplant, Erwartetes als erwartet formuliert.
- [ ] Keine Zahl ohne Beleg, auch nicht in Grafiken oder Animationen.
- [ ] Kein Text, kein Bild und keine Metadaten legen eine bewilligte Förderung
      nahe; kein Fördergeberlogo ohne Bewilligung.
- [ ] Jede genannte Organisation und jedes Logo hat eine schriftliche Freigabe
      für diese Verwendung.
- [ ] Keine unscharfen oder verfremdeten Logos nicht bestätigter
      Organisationen.
- [ ] Jede Mediendatei steht mit Lizenz in
      [assets-and-licenses.md](assets-and-licenses.md); Metadaten sind
      geprüft.

### Technik

- [ ] `python scripts/check-public-content.py --release --history` mit
      Begriffsliste ohne Fehler.
- [ ] Testplan aus [development.md](development.md) durchlaufen.
- [ ] Keine externen Ressourcen, kein Tracking, keine Cookies.
- [ ] Animationen respektieren reduzierte Bewegung und lassen sich anhalten,
      wenn sie länger als fünf Sekunden laufen.

### Ablauf

- [ ] Alle Seiten tragen `release-status` `released`.
- [ ] Der Pull Request mit der Freigabe ist von der verantwortlichen Person
      genehmigt und nach `main` zusammengeführt.
- [ ] Die Repository-Variable `PAGES_RELEASE_APPROVED` steht auf `true`.
- [ ] Der Workflow „Deploy to GitHub Pages“ wird manuell gestartet; das
      Bestätigungsfeld enthält `VEROEFFENTLICHEN`.
- [ ] Nach dem Deployment: Startseite, Rechtsseiten und 404-Seite unter der
      eigenen Domain mit HTTPS geprüft.
- [ ] `PAGES_RELEASE_APPROVED` wird nach dem Deployment wieder auf `false`
      gesetzt.
