# Inhaltsregeln

Diese Regeln konkretisieren [AGENTS.md](../AGENTS.md) für die Arbeit an Texten,
Grafiken und Medien. Sie gelten für alles, was in `site/` landet, und für alle
Dateien, die das Repository öffentlich macht.

## Freigabestufen

Jede Seite trägt im Kopf ein Metatag mit ihrem Freigabestatus:

```html
<meta name="release-status" content="draft">
```

| Status | Bedeutung |
| --- | --- |
| `draft` | Entwurf; ein Deployment ist gesperrt |
| `review` | inhaltlich fertig, Freigabe ausstehend; ein Deployment ist gesperrt |
| `released` | von der verantwortlichen Person freigegeben |

Das Prüfskript lässt im Freigabemodus nur Seiten ohne `draft` zu. Der Status
`review` ist für die Durchsicht gedacht; er wird vor dem Deployment manuell auf
`released` gesetzt, sobald die Checkliste abgearbeitet ist. Platzhalter im
Markup tragen das Attribut `data-placeholder`, offene Angaben in rechtlichen
Texten das Attribut `data-open` und den Text `[OFFEN: …]`. Beides blockiert ein
Deployment.

## Fachliche Aussagen

Jede fachliche Aussage gehört zu genau einer der folgenden Kategorien, und die
Formulierung macht die Kategorie erkennbar:

| Kategorie | Formulierung | Beispielmuster |
| --- | --- | --- |
| belegtes Ergebnis | Präsens oder Perfekt, mit Quelle | „Vorarbeiten haben gezeigt, dass … [Quelle]“ |
| prototypisch umgesetzt | Präsens mit Einordnung | „Ein Prototyp setzt … bereits um.“ |
| geplante Forschung | Futur oder Zielformulierung | „Das Vorhaben soll … untersuchen.“ |
| erwarteter Nutzen | Erwartung, kein Versprechen | „Wir erwarten, dass … helfen kann.“ |
| offene Frage | Frage oder Hypothese | „Ob … gelingt, ist eine der Forschungsfragen.“ |

Unzulässig sind Zahlen ohne Beleg, Superlative ohne Vergleichsgrundlage
(„erstmals“, „einzigartig“, „weltweit führend“) und Aussagen über Ergebnisse,
die noch nicht vorliegen.

## Förderstatus

Bis zu einer Förderzusage erscheinen weder Fördergeberlogos noch Förderhinweise.
Texte beschreiben das Vorhaben als geplant. Der Fußbereich jeder Seite enthält
den Satz „Eine öffentliche Förderung ist nicht bewilligt.“, bis die Bewilligung
vorliegt.

## Organisationen und Personen

- Organisationen werden nur mit dokumentierter Freigabe genannt oder mit Logo
  gezeigt.
- Personen werden nur mit ihrer Zustimmung genannt; Fotos von Personen nur mit
  Einwilligung.
- Unscharfe oder verfremdete Logos nicht bestätigter Organisationen werden
  öffentlich nicht verwendet.
- Für noch offene Beteiligungen sind neutrale Formulierungen zulässig, die keine
  Organisation erkennen lassen, zum Beispiel eine allgemeine Branchenangabe ohne
  Namen und ohne Merkmale, die auf ein bestimmtes Unternehmen schließen lassen.

## Bilder, Grafiken und Medien

- Eigene Grafiken und Visualisierungen haben Vorrang.
- Jede Mediendatei wird in [assets-and-licenses.md](assets-and-licenses.md)
  eingetragen: Datei, Herkunft, Urheber, Lizenz, Freigabe, Datum.
- Metadaten (EXIF, XMP, Autorennamen in SVG oder PDF) werden vor dem Commit
  entfernt oder geprüft.
- Fahrzeugdarstellungen zeigen keine erkennbaren Serienmodelle, Marken oder
  Kennzeichen, solange keine Freigabe des Rechteinhabers vorliegt.
- KI-generierte Bilder werden nur nach Prüfung von Nutzungsbedingungen und
  Kennzeichnungspflicht verwendet und im Medienverzeichnis als solche
  vermerkt.

## Versehentliche Veröffentlichung

Wenn vertrauliche Inhalte oder Zugangsdaten committet oder gepusht wurden:

1. **Zugangsdaten sofort ungültig machen.** Ein Token oder Schlüssel, der in
   einem Push enthalten war, gilt als kompromittiert, auch wenn das Repository
   privat ist.
2. **Nicht einfach löschen und weiterarbeiten.** Ein Folgecommit entfernt die
   Datei nicht aus der Historie.
3. **Verantwortliche Person informieren** und den Umfang festhalten: welche
   Datei, welche Commits, seit wann sichtbar, ob das Repository öffentlich war.
4. **Historie bereinigen**, zum Beispiel mit `git filter-repo`, und den
   bereinigten Stand mit Zustimmung der verantwortlichen Person erzwungen
   pushen. Dafür wird der Schutz von `main` kurzzeitig gelockert und danach
   wiederhergestellt.
5. **GitHub-Support kontaktieren**, wenn das Repository öffentlich war, damit
   zwischengespeicherte Ansichten und Pull-Request-Referenzen entfernt werden.
   Forks und lokale Kopien Dritter lassen sich nicht zurückholen.
6. **Betroffene informieren**, wenn Daten Dritter betroffen sind; bei
   personenbezogenen Daten wird der Datenschutzbeauftragte einbezogen.
7. **Ursache abstellen**, etwa durch einen zusätzlichen Begriff in der lokalen
   Begriffsliste oder eine neue Regel im Prüfskript.
