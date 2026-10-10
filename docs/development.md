# Entwicklung

## Voraussetzungen

- Git ab Version 2.40
- Python ab Version 3.10 (nur Standardbibliothek)
- ein aktueller Browser; für Prüfungen zusätzlich Lighthouse (in Chromium-Browsern
  eingebaut) und ein Barrierefreiheitsprüfer wie axe als lokale
  Browsererweiterung

Es gibt keinen Build-Schritt und keine Paketabhängigkeiten.

## Einrichtung einer Arbeitskopie

```sh
git clone https://github.com/<eigentümer>/load-encode-website.git
cd load-encode-website

# Commit-Identität: Noreply-Adresse des eigenen GitHub-Kontos
git config --local user.name "<GitHub-Kontoname>"
git config --local user.email "<id>+<konto>@users.noreply.github.com"

# Pre-Push-Hook aktivieren
git config --local core.hooksPath scripts/hooks

# Lokale Begriffsliste einbinden (Datei liegt außerhalb dieses Repositorys)
git config --local loadencode.denylist "<pfad-zur-begriffsliste>"
```

Die Noreply-Adresse steht in den GitHub-Einstellungen unter „Emails“. In den
GitHub-Kontoeinstellungen sollte zusätzlich „Block command line pushes that
expose my email“ aktiviert sein.

## Lokale Begriffsliste

Das Prüfskript kann eine Liste von Begriffen einlesen, die nie öffentlich
werden dürfen, etwa Namen von Organisationen ohne Freigabe, interne
Projektbezeichnungen oder Ordnernamen. Diese Liste ist selbst vertraulich und
liegt deshalb im internen Arbeitsbereich, nicht in diesem Repository. Das
Skript bricht ab, wenn die Liste innerhalb des Repositorys liegt.

Format: ein Begriff je Zeile, Groß- und Kleinschreibung spielt keine Rolle.
Zeilen mit `#` sind Kommentare, `re:` leitet einen regulären Ausdruck ein.

## Prüfen

```sh
# Standardprüfung des Arbeitsstands (auch neue, noch nicht versionierte Dateien)
python scripts/check-public-content.py

# zusätzlich die gesamte Historie und alle Commit-Nachrichten
python scripts/check-public-content.py --history

# Freigabeprüfung, wie sie das Deployment ausführt
python scripts/check-public-content.py --release
```

Unter Windows mit einer Konsole ohne UTF-8 hilft `python -X utf8 …`.

Das Skript prüft

- Pflichtdateien,
- nicht zulässige Dateitypen im ganzen Repository und nicht vorgesehene
  Dateitypen in `site/`,
- symbolische Links und Submodule,
- mögliche Zugangsdaten,
- lokale und Netzwerkpfade,
- Kennungen interner Register und Dokumentnummern,
- Begriffe der lokalen Begriffsliste,
- Tracking, externe Dienste und Vertraulichkeitsvermerke in `site/`,
- HTML-Grundlagen (Doctype, `lang`, `title`, Viewport, `alt`, eindeutige `id`,
  genau eine `h1`),
- externe Ressourcen in HTML und CSS,
- interne Links und Sprungziele,
- Netzwerkzugriffe im JavaScript (als Warnung),
- im Freigabemodus Entwurfsmarker, Platzhalter und offene Angaben.

## Lokale Vorschau

```sh
python -m http.server 8000 --directory site
```

Danach `http://localhost:8000` öffnen. Die 404-Seite verwendet wurzelrelative
Pfade, weil GitHub Pages sie unter beliebigen Adressen ausliefert. In der
lokalen Vorschau funktioniert sie deshalb nur unter `http://localhost:8000/404.html`.

## Testplan vor einer Freigabe

| Bereich | Prüfung |
| --- | --- |
| Darstellung | Breiten 360, 768, 1024, 1440 und 1920 px; Hoch- und Querformat |
| Browser | aktuelle Fassungen von Chrome, Edge, Firefox und Safari (macOS und iOS) |
| Tastatur | alle Bedienelemente per Tab erreichbar, Fokus sichtbar, keine Fokusfalle |
| Screenreader | Grundprüfung mit NVDA (Windows) und VoiceOver (macOS oder iOS) |
| Bewegung | Systemeinstellung „Bewegung reduzieren“ aktiv und inaktiv |
| JavaScript | Seite mit deaktiviertem JavaScript lesbar und navigierbar |
| Lighthouse | Zielwerte aus [architecture.md](architecture.md) |
| axe | keine Verstöße der Stufen „critical“ und „serious“ |
| Links | Prüfskript ohne Fehler; externe Links manuell öffnen |
| Inhalt | Prüfskript mit `--release --history` und Begriffsliste ohne Fehler |

Prüfwerkzeuge laufen lokal. Unveröffentlichte Seiten werden nicht in
Online-Prüfdienste hochgeladen.

## Zeilenenden und Formatierung

`.gitattributes` erzwingt LF im Repository. `.editorconfig` legt Einrückung und
Zeichensatz fest. Das Prüfskript folgt PEP 8 mit einer Zeilenlänge von 120
Zeichen (`setup.cfg`).
