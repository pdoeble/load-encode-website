# Mitwirken

Beiträge kommen derzeit ausschließlich aus dem Projektteam. Externe Pull
Requests werden nicht angenommen, solange das Vorhaben in Vorbereitung ist.

## Voraussetzungen

- Git mit der GitHub-Noreply-Adresse als Commit-Adresse
  (`git config --local user.email <id>+<konto>@users.noreply.github.com`)
- Python ab Version 3.10 für das Prüfskript
- ein aktueller Browser für die lokale Vorschau

## Ablauf

1. Branch von `main` anlegen, zum Beispiel `inhalt/hero-text` oder
   `technik/kontrast-tokens`.
2. Änderungen vornehmen und lokal prüfen:
   `python scripts/check-public-content.py`.
3. Commit mit sachlicher Nachricht im Präsens, zum Beispiel
   „Ergänzt Fokusstil für Schaltflächen“. Keine internen Bezüge.
4. Push und Pull Request nach `main`. Die Vorlage enthält die Prüfliste.
5. Die Prüfung `validate` muss grün sein. Eine zweite Person sieht den Pull
   Request durch, sobald zwei Personen Zugriff haben.
6. Zusammenführen per Squash-Merge; der Branch wird danach automatisch
   gelöscht.

## Was in einen Pull Request gehört

- eine kurze Beschreibung, was sich für Besucher ändert,
- bei neuen Medien: Herkunft, Urheber, Lizenz und Freigabe, eingetragen in
  `docs/assets-and-licenses.md`,
- bei neuen fachlichen Aussagen: die Quelle oder die Freigabe, auf die sich die
  Aussage stützt,
- bei Animationen: welche Information sie vermittelt und wie sie sich bei
  reduzierter Bewegung verhält.

## Was nicht in einen Pull Request gehört

Alles, was in [AGENTS.md](AGENTS.md), Abschnitt 4, aufgeführt ist. Im Zweifel
nicht committen und die verantwortliche Person fragen.
