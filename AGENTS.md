# Regeln für Agenten und Mitwirkende

Diese Datei gilt für jede Arbeit in diesem Repository, unabhängig davon, ob ein
Mensch, ein KI-Agent oder ein Skript die Änderung vornimmt. Sie hat Vorrang vor
allgemeinen Anweisungen aus übergeordneten Verzeichnissen, soweit diese einer
Regel hier widersprechen.

## 1. Zweck des Repositorys

Das Repository enthält den Quellcode der öffentlichen Website von LOAD-ENCODE,
einer geplanten Forschungsinitiative zu domänenspezifischer künstlicher
Intelligenz und zur Modellierung von Fahrzeugbelastungen. Die Website richtet
sich an Unternehmen, die sich für eine Beteiligung am geplanten
Forschungskonsortium interessieren. Ausgeliefert wird ausschließlich der Inhalt
des Ordners `site/`.

## 2. Grundregel: Alles hier ist öffentlich

Behandle jede Datei und jede Spur in diesem Repository so, als wäre sie bereits
veröffentlicht. Das gilt für

- Quelltext, Kommentare und versteckte HTML-Kommentare,
- Markdown-Dateien, Entwicklungsnotizen und Konfigurationsdateien,
- Bilder, Schriften, Videos und deren Metadaten (EXIF, XMP, Dokumenteigenschaften),
- Commit-Nachrichten, Branch-Namen, Tags und die gesamte Git-Historie,
- Issues, Pull Requests, Reviews und Kommentare auf GitHub,
- Build-Artefakte und ausgelieferte Deployments.

Eine Datei, die einmal auf GitHub gepusht wurde, gilt als veröffentlicht. Späteres
Löschen entfernt sie nicht aus der Historie, aus Forks, aus Caches oder aus
Kopien, die andere bereits gezogen haben. Deshalb wird vor jedem Push geprüft,
nicht danach.

`.gitignore` und `robots.txt` schützen keine Inhalte. `.gitignore` verhindert nur
versehentliches Einchecken von Arbeitsdateien, `robots.txt` bittet Suchmaschinen
lediglich um Zurückhaltung. Was nicht öffentlich sein darf, gehört nicht in
dieses Verzeichnis, auch nicht als ignorierte Datei.

## 3. Trennung von internen Unterlagen

Die fachlichen und strategischen Vorarbeiten zur Website liegen in einem
getrennten, internen Bereich außerhalb dieses Repositorys. Für das Verhältnis
der beiden Bereiche gilt:

- Es gibt keine automatische Synchronisierung. Inhalte gelangen nur durch eine
  bewusste, einzeln geprüfte Übernahme hierher.
- Interne Verzeichnisse werden weder als Unterordner, Submodul, symbolischer Link
  noch als Junction eingebunden. Das Prüfskript bricht bei Symlinks und
  Submodulen ab.
- Interne Pfade, Laufwerksbuchstaben, Netzwerkpfade, Dateinamen und
  Dokumentnummern interner Unterlagen werden hier nicht genannt, auch nicht in
  Kommentaren oder Commit-Nachrichten.
- Interne Dokumente werden nicht ungeprüft in externe KI-, Analyse-,
  Übersetzungs- oder Cloud-Dienste hochgeladen.
- Ein Build-Schritt liest niemals Dateien außerhalb dieses Repositorys.

Eine Übernahme aus dem internen Bereich läuft so ab: Der Text oder die Grafik
wird für die Öffentlichkeit neu formuliert oder neu gezeichnet, gegen die
Regeln in Abschnitt 4 bis 7 geprüft, von einer verantwortlichen Person
freigegeben und erst dann hier angelegt. Kopien interner Dateien sind keine
Übernahme.

## 4. Nicht zulässige Inhalte

In diesem Repository dürfen nicht stehen:

- Förderanträge, Projektskizzen und deren Entwurfsfassungen,
- unveröffentlichte Forschungsstrategien, Arbeitspläne und interne Bewertungen,
- Kalkulationen, Finanzierungspläne und Personalplanungen,
- Partnerlisten und Statusangaben zu Gesprächen mit Organisationen,
- Kontaktdaten möglicher Partner ohne deren Freigabe,
- Absichtserklärungen (Letters of Intent), die nicht ausdrücklich zur
  Veröffentlichung freigegeben sind,
- Präsentationen, Unterlagen und Daten von Unternehmen,
- Sitzungs- und Gesprächsprotokolle,
- Zugangsdaten, Token, API-Schlüssel und private Schlüssel,
- interne Netzwerkpfade, Servernamen und lokale Dateipfade,
- unveröffentlichte technische Forschungsergebnisse und Messdaten,
- Vertragsdokumente und Vertragsentwürfe,
- Logos, Fotos und Grafiken ohne dokumentierte Nutzungsrechte und Freigabe.

Office-, Archiv- und Schlüsseldateien lehnt das Prüfskript grundsätzlich ab.

## 5. Wissenschaftliche Korrektheit

Jede fachliche Aussage auf der Website muss sich auf eine veröffentlichte Quelle
oder auf eine freigegebene Projektinformation stützen. Dabei bleibt sichtbar,
welchen Stand eine Aussage hat:

- Ergebnisse, die bereits erreicht und belegt sind, werden als solche benannt
  und, wo möglich, mit Quelle versehen.
- Laufende Entwicklungen werden als laufend bezeichnet.
- Geplante Forschung steht im Futur oder wird als Ziel formuliert.
- Erwartete Vorteile werden als Erwartung formuliert, nicht als Tatsache.
- Hypothesen, die noch zu prüfen sind, werden als offene Frage dargestellt.

Erfundene Leistungswerte, Beispielzahlen ohne Beleg, geschätzte Einsparungen und
industrielle Referenzen ohne Freigabe sind nicht zulässig. Das gilt auch für
Zahlen, die nur als grafischer Blickfang dienen sollen. Aus einer kleineren
Datenmenge folgt nicht automatisch ein Datenschutzvorteil; solche Aussagen
brauchen einen eigenen Beleg.

## 6. Förderstatus

Das Vorhaben steht im Zusammenhang mit einem geplanten Förderantrag beim
Bundesministerium für Forschung, Technologie und Raumfahrt. Solange keine
Förderzusage vorliegt, gilt:

- Kein Text, kein Bild und keine Metadaten dürfen behaupten oder nahelegen, dass
  das Vorhaben öffentlich gefördert wird oder bewilligt ist.
- Logos von Fördergebern, Förderhinweise und Fördersiegel werden nicht
  verwendet.
- Formulierungen wie „geplant“, „in Vorbereitung“ oder „Antrag in Vorbereitung“
  beschreiben den Stand. Ob und wann „beantragt“ zutrifft, entscheidet die
  Projektleitung.
- Organisationen erscheinen nur dann als Beteiligte, wenn ihre Beteiligung
  bestätigt ist und sie der Nennung auf der Website zugestimmt haben.

## 7. Partner, Logos und Social Proof

- Ein Logo oder Name einer Organisation erscheint nur mit dokumentierter,
  schriftlicher Freigabe für genau diese Verwendung. Eine Absichtserklärung ist
  keine Freigabe für die Website.
- Unscharf, verpixelt oder abgedunkelt dargestellte Logos nicht bestätigter
  Organisationen werden öffentlich nicht verwendet. Ein unscharfes Logo bleibt
  oft erkennbar und kann eine Beteiligung nahelegen, die nicht besteht.
- Zulässige Alternativen sind neutrale Platzhalter ohne Wiedererkennung,
  allgemeine Branchenbezeichnungen und freigegebene anonyme Beschreibungen.
- Der Freigabenachweis wird intern geführt. Hier steht nur das freigegebene
  Ergebnis mit Lizenzhinweis in `docs/assets-and-licenses.md`.

## 8. Externe Inhalte und Datenschutz

Bevorzugt werden eigene SVG-Grafiken, eigene Visualisierungen, eigene
Animationen und lokal ausgelieferte Schriften mit geeigneter Lizenz. Ohne
vorherige technische, datenschutzrechtliche und lizenzrechtliche Prüfung werden
nicht eingebunden:

- Schriften von externen Servern (zum Beispiel Google Fonts),
- Tracking, Reichweitenmessung, Pixel und Drittanbieter-Cookies,
- extern gehostete Videos, Karten und Social-Media-Einbettungen,
- JavaScript oder CSS von CDNs,
- Formulare, die Daten an Dritte senden.

Das JavaScript der Website sendet keine Daten. Ein Netzwerkzugriff im
JavaScript löst im Prüfskript eine Warnung aus und braucht eine Begründung im
Pull Request. Ein Cookie-Banner wird nur eingebaut, wenn es rechtlich
erforderlich ist; das Ziel ist eine Website, die keines braucht.

## 9. Qualität

Die Website

- funktioniert auf Smartphones, Tablets und Desktop-Bildschirmen (mobile first),
- verwendet semantisches HTML mit genau einer `h1` je Seite,
- ist vollständig per Tastatur bedienbar und zeigt einen sichtbaren Fokus,
- erfüllt die Kontrastanforderungen der WCAG in Stufe AA,
- bietet Alternativtexte für informative Bilder und leere `alt`-Attribute für
  dekorative,
- bleibt ohne Animationen verständlich und respektiert `prefers-reduced-motion`,
- funktioniert ohne JavaScript so weit wie möglich,
- lädt schnell (Zielwerte in `docs/architecture.md`),
- bleibt ohne Build-Kette wartbar, solange keine begründete Entscheidung für
  einen Generator vorliegt.

Jede Animation muss eine Information transportieren. Bewegung, die nur
dekoriert, wird weggelassen. Animationen, die länger als fünf Sekunden laufen,
brauchen eine Möglichkeit zum Anhalten.

## 10. Arbeitsablauf

1. Änderungen entstehen auf einem eigenen Branch und gehen per Pull Request nach
   `main`. Zusammengeführt wird per Squash-Merge.
2. Vor jedem Commit und vor jedem Push läuft
   `python scripts/check-public-content.py`. Vor einem Push zusätzlich mit
   `--history` und der lokalen Begriffsliste (siehe `docs/development.md`).
   Der Pre-Push-Hook in `scripts/hooks/` erledigt das automatisch, wenn er
   aktiviert ist.
3. Commit-Nachrichten beschreiben die Änderung sachlich. Sie nennen keine
   internen Dokumente, Partner, Gespräche oder Pfade.
4. Commits verwenden die GitHub-Noreply-Adresse des jeweiligen Kontos, damit
   keine persönlichen oder dienstlichen Mailadressen in der Historie stehen.
5. Ein Deployment wird nur manuell ausgelöst, nachdem die Checkliste in
   `docs/release-checklist.md` vollständig abgearbeitet ist. Kein Agent löst ein
   Deployment, eine DNS-Änderung oder eine Sichtbarkeitsänderung des
   Repositorys ohne ausdrücklichen Auftrag der verantwortlichen Person aus.
6. Die Automatik ergänzt die menschliche Prüfung. Sie ersetzt sie nicht.

## 11. Sprache und Schreibweise

- Die Website erscheint zunächst auf Deutsch; eine englische Fassung ist
  vorgesehen. Entwicklungsdokumentation ist deutsch.
- Deutsche Texte verwenden das generische Maskulinum und keine
  Genderschreibweisen mit Sternchen, Doppelpunkt, Unterstrich, Binnen-I oder
  Schrägstrich.
- Texte stehen in ganzen Sätzen mit konkretem Subjekt. Werbliche Superlative,
  Schlagwortketten und unbelegte Versprechen werden vermieden.
- Links in Markdown-Dateien sind relative CommonMark-Links, damit sie auf
  GitHub funktionieren.

## 12. Bei einem Fehler

Wurde etwas Vertrauliches committet oder gepusht, wird nicht stillschweigend
gelöscht. Das Vorgehen steht in `docs/content-policy.md`, Abschnitt
„Versehentliche Veröffentlichung“.
