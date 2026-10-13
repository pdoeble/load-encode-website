#!/usr/bin/env python3
"""Prueft, ob die Inhalte dieses Repositorys veroeffentlicht werden duerfen.

Aufruf aus der Repository-Wurzel:

  python scripts/check-public-content.py               Standardpruefung (CI, vor jedem Commit)
  python scripts/check-public-content.py --release     zusaetzlich Freigabepruefung fuer ein Deployment
  python scripts/check-public-content.py --history     zusaetzlich gesamte Git-Historie und Commit-Nachrichten
  python scripts/check-public-content.py --denylist P  lokale Begriffsliste einbeziehen

Die lokale Begriffsliste enthaelt Begriffe, die nie oeffentlich werden duerfen,
zum Beispiel Namen nicht freigegebener Partner. Weil die Liste selbst vertraulich
ist, liegt sie ausserhalb dieses Repositorys. Statt --denylist kann der Pfad in der
Umgebungsvariablen LOAD_ENCODE_DENYLIST oder per
`git config --local loadencode.denylist <pfad>` hinterlegt werden.
Format: ein Begriff je Zeile (Gross-/Kleinschreibung egal), `re:` leitet einen
regulaeren Ausdruck ein, `#` eine Kommentarzeile.

Exit-Code 0 bedeutet keine Fehler, 1 mindestens einen Fehler. Warnungen brechen
nicht ab. Die automatische Pruefung ergaenzt die manuelle Freigabe, sie ersetzt
sie nicht (siehe docs/release-checklist.md).
"""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SITE = "site/"
SELF = "scripts/check-public-content.py"

REQUIRED_FILES = [
    "README.md",
    "AGENTS.md",
    "SECURITY.md",
    ".gitignore",
    ".gitattributes",
    ".github/workflows/deploy-pages.yml",
    ".github/workflows/validate.yml",
    "site/index.html",
    "site/404.html",
    "site/impressum.html",
    "site/datenschutz.html",
    "site/barrierefreiheit.html",
    "site/robots.txt",
    "site/sitemap.xml",
    "site/favicon.svg",
    "site/assets/css/main.css",
    "site/assets/js/main.js",
]

LEGAL_PAGES = ["impressum.html", "datenschutz.html", "barrierefreiheit.html"]

# Dateitypen, die im ganzen Repository nicht vorkommen duerfen (typische Antrags-,
# Office-, Archiv- und Schluesseldateien).
BLOCKED_EXTENSIONS = {
    ".doc", ".docx", ".docm", ".xls", ".xlsx", ".xlsm", ".ppt", ".pptx", ".pptm",
    ".odt", ".ods", ".odp", ".msg", ".eml", ".tex", ".bib", ".bbl",
    ".zip", ".7z", ".rar", ".tar", ".gz",
    ".pem", ".key", ".p12", ".pfx", ".kdbx", ".env", ".sqlite", ".db",
    ".psd", ".ai", ".indd",
}

# Dateitypen, die in site/ erlaubt sind. Alles andere bricht ab.
SITE_EXTENSIONS = {
    ".html", ".css", ".js", ".mjs", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".avif",
    ".gif", ".ico", ".woff2", ".woff", ".txt", ".xml", ".json", ".webmanifest",
    ".mp4", ".webm", ".vtt", ".pdf", ".vcf",
}

TEXT_EXTENSIONS = {
    ".html", ".htm", ".css", ".js", ".mjs", ".json", ".webmanifest", ".svg", ".xml",
    ".txt", ".md", ".yml", ".yaml", ".toml", ".py", ".ps1", ".sh", ".cfg", ".ini",
    ".vtt", ".vcf", "",
}

MAX_FILE_BYTES = 5 * 1024 * 1024
# Filme in site/ duerfen groesser sein (Film der Startseite in voller Qualitaet, Freigabe vom 13.10.2026).
MAX_VIDEO_BYTES = 25 * 1024 * 1024
VIDEO_EXTENSIONS = {".mp4", ".webm"}
WARN_FILE_BYTES = 1 * 1024 * 1024

SECRET_PATTERNS = [
    ("GitHub-Token", re.compile(r"\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{22,})\b")),
    ("AWS-Zugangsschluessel", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("privater Schluessel", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")),
    ("Slack-Token", re.compile(r"\bxox[abprs]-[A-Za-z0-9-]{10,}")),
    ("Google-API-Schluessel", re.compile(r"\bAIza[0-9A-Za-z_\-]{35}\b")),
    ("API-Schluessel (sk-)", re.compile(r"\bsk-(?:ant-|proj-)?[A-Za-z0-9_\-]{20,}")),
    ("Azure-Speicherschluessel", re.compile(r"AccountKey=[A-Za-z0-9+/=]{40,}")),
    ("Passwort oder Schluessel als Zuweisung", re.compile(
        r"(?i)\b(?:password|passwort|passwd|secret|api[_-]?key|access[_-]?token|client[_-]?secret)\b"
        r"\s*[:=]\s*['\"][^'\"\s]{8,}['\"]")),
]

LOCAL_PATH_PATTERNS = [
    ("Windows-Pfad", re.compile(r"(?<![A-Za-z0-9])[A-Za-z]:\\[^\s\"'<>|]+")),
    ("Windows-Pfad mit Schraegstrich", re.compile(r"(?<![A-Za-z0-9])[A-Za-z]:/(?!/)[^\s\"'<>]+")),
    ("Netzwerkpfad", re.compile(r"\\\\[A-Za-z0-9._-]+\\[^\s\"'<>]+")),
    ("lokaler Benutzerpfad", re.compile(r"/(?:Users|home)/[A-Za-z0-9._-]+/|/c/Users/")),
    ("file-URL", re.compile(r"file:/{2,3}", re.I)),
]

# Kennungen interner Register und Dokumentnummern. Sie verraten fuer sich wenig,
# zeigen aber, dass Text aus internen Unterlagen uebernommen wurde.
INTERNAL_PATTERNS = [
    ("interne Dokumentnummer", re.compile(r"\bBMFTR_\d{2,3}_")),
    ("interne Registerkennung", re.compile(r"\b(?:OQ|DEC|REQ|SRC|CON)-(?:[A-Z]+-)?\d{2,4}\b")),
]

# Nur in site/: Vertraulichkeitsvermerke, Tracking und externe Dienste.
SITE_ONLY_PATTERNS = [
    ("Vertraulichkeitsvermerk", re.compile(
        r"(?i)\b(?:vertraulich|confidential|nur intern|internal use only|nicht zur weitergabe|do not distribute)\b")),
    ("Tracking oder externer Dienst", re.compile(
        r"(?i)google-analytics|googletagmanager|gtag\(|fbq\(|matomo|hotjar|plausible\.io|clarity\.ms|"
        r"doubleclick|connect\.facebook|snap\.licdn|fonts\.googleapis|fonts\.gstatic|use\.typekit|"
        r"cdn\.jsdelivr|unpkg\.com|cdnjs\.cloudflare|youtube\.com/embed|player\.vimeo")),
]

JS_NETWORK_PATTERN = re.compile(r"\bfetch\(|XMLHttpRequest|sendBeacon|new WebSocket|EventSource\(")
CSS_EXTERNAL_PATTERN = re.compile(r"(?i)(?:url\(\s*['\"]?(?:https?:)?//|@import\s+(?:url\()?\s*['\"]?(?:https?:)?//)")
OPEN_MARKER = re.compile(r"\[OFFEN")


@dataclass
class Finding:
    level: str  # FEHLER, WARNUNG, HINWEIS
    path: str
    line: int
    message: str


class Report:
    def __init__(self) -> None:
        self.items: list[Finding] = []

    def add(self, level: str, path: str, message: str, line: int = 0) -> None:
        self.items.append(Finding(level, path, line, message))

    def error(self, path: str, message: str, line: int = 0) -> None:
        self.add("FEHLER", path, message, line)

    def warn(self, path: str, message: str, line: int = 0) -> None:
        self.add("WARNUNG", path, message, line)

    def note(self, path: str, message: str, line: int = 0) -> None:
        self.add("HINWEIS", path, message, line)

    @property
    def errors(self) -> int:
        return sum(1 for f in self.items if f.level == "FEHLER")


# ---------------------------------------------------------------- Hilfsfunktionen

def git(*args: str) -> bytes:
    return subprocess.check_output(["git", *args], cwd=ROOT, stderr=subprocess.DEVNULL)


def list_files() -> tuple[list[str], set[str]]:
    """Versionierte und neue, nicht ignorierte Dateien; dazu die Symlinks und Submodule."""
    try:
        tracked = git("ls-files", "-z").decode("utf-8").split("\0")
        others = git("ls-files", "-z", "--others", "--exclude-standard").decode("utf-8").split("\0")
        stage = git("ls-files", "-s", "-z").decode("utf-8").split("\0")
    except (OSError, subprocess.CalledProcessError):
        files = [p.relative_to(ROOT).as_posix() for p in ROOT.rglob("*")
                 if p.is_file() and ".git" not in p.parts]
        return sorted(files), set()
    special = set()
    for entry in filter(None, stage):
        mode, _, rest = entry.partition(" ")
        if mode in {"120000", "160000"}:
            special.add(rest.split("\t", 1)[1])
    files = sorted({p for p in tracked + others if p and (ROOT / p).exists()})
    return files, special


def read_text(path: Path) -> str | None:
    try:
        data = path.read_bytes()
    except OSError:
        return None
    if b"\0" in data[:4096]:
        return None
    try:
        return data.decode("utf-8")
    except UnicodeDecodeError:
        return None


def line_of(text: str, index: int) -> int:
    return text.count("\n", 0, index) + 1


def load_denylist(cli_path: str | None) -> list[tuple[str, re.Pattern[str]]]:
    path = cli_path or os.environ.get("LOAD_ENCODE_DENYLIST")
    if not path:
        try:
            path = git("config", "--get", "loadencode.denylist").decode("utf-8").strip()
        except (OSError, subprocess.CalledProcessError):
            path = ""
    if not path:
        return []
    deny_path = Path(path).expanduser()
    if not deny_path.is_file():
        raise SystemExit(f"Begriffsliste nicht gefunden: {deny_path}")
    try:
        deny_path.resolve().relative_to(ROOT)
    except ValueError:
        pass
    else:
        raise SystemExit("Die Begriffsliste darf nicht im Repository liegen.")
    patterns = []
    for raw in deny_path.read_text(encoding="utf-8").splitlines():
        term = raw.strip()
        if not term or term.startswith("#"):
            continue
        if term.startswith("re:"):
            patterns.append((term, re.compile(term[3:], re.I)))
        else:
            patterns.append((term, re.compile(re.escape(term), re.I)))
    return patterns


def scan(text: str, patterns, report: Report, path: str, level: str, label: str) -> None:
    for name, pattern in patterns:
        for match in pattern.finditer(text):
            shown = name if label == "Begriffsliste" else f"{name}: {match.group(0)[:60]}"
            report.add(level, path, f"{label}: {shown}", line_of(text, match.start()))


# ---------------------------------------------------------------- HTML-Pruefung

class PageParser(HTMLParser):
    RESOURCE_ATTRS = {
        "script": ["src"], "img": ["src", "srcset"], "source": ["src", "srcset"],
        "video": ["src", "poster"], "audio": ["src"], "track": ["src"],
        "iframe": ["src"], "embed": ["src"], "object": ["data"],
    }
    # link-Elemente, die etwas laden. canonical und alternate verweisen nur.
    LINK_RESOURCE_RELS = {"stylesheet", "icon", "preload", "modulepreload", "prefetch",
                          "manifest", "apple-touch-icon", "mask-icon"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.lang = None
        self.title = ""
        self._in_title = False
        self.has_viewport = False
        self.release_status = None
        self.robots = ""
        self.h1 = 0
        self.ids: dict[str, int] = {}
        self.links: list[tuple[str, int]] = []
        self.resources: list[tuple[str, str, int]] = []
        self.images_without_alt: list[int] = []
        self.inline_handlers: list[int] = []
        self.placeholders: list[int] = []
        self.frames: list[int] = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        line = self.getpos()[0]
        if tag == "html":
            self.lang = a.get("lang")
        if tag == "title":
            self._in_title = True
        if tag == "meta" and a.get("name") == "viewport":
            self.has_viewport = True
        if tag == "meta" and a.get("name") == "release-status":
            self.release_status = (a.get("content") or "").strip().lower()
        if tag == "meta" and (a.get("name") or "").lower() == "robots":
            self.robots = (a.get("content") or "").lower()
        if tag == "h1":
            self.h1 += 1
        if "id" in a and a["id"]:
            self.ids[a["id"]] = self.ids.get(a["id"], 0) + 1
        if tag == "a" and a.get("href") is not None:
            self.links.append((a["href"], line))
        if tag == "link" and a.get("href"):
            rels = set((a.get("rel") or "").lower().split())
            if rels & self.LINK_RESOURCE_RELS:
                self.resources.append(("link", a["href"], line))
            elif not rels & {"canonical", "alternate"}:
                self.resources.append(("link", a["href"], line))
        for attr in self.RESOURCE_ATTRS.get(tag, []):
            if a.get(attr):
                for part in a[attr].split(","):
                    url = part.strip().split(" ")[0]
                    if url:
                        self.resources.append((tag, url, line))
        if tag == "img" and "alt" not in a:
            self.images_without_alt.append(line)
        if tag in {"iframe", "embed", "object"}:
            self.frames.append(line)
        if any(k.startswith("on") for k in a):
            self.inline_handlers.append(line)
        if "data-placeholder" in a or "data-open" in a:
            self.placeholders.append(line)

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data


def is_external(url: str) -> bool:
    return url.startswith(("http://", "https://", "//"))


def resolve_local(page: Path, url: str) -> Path | None:
    parts = urlsplit(url)
    if parts.scheme or parts.netloc:
        return None
    target = unquote(parts.path)
    if not target:
        return None
    base = ROOT / SITE if target.startswith("/") else page.parent
    resolved = (base / target.lstrip("/")).resolve()
    if target.endswith("/") or resolved.is_dir():
        resolved = resolved / "index.html"
    return resolved


def check_html(rel: str, text: str, report: Report, release: bool) -> PageParser:
    page = ROOT / rel
    parser = PageParser()
    parser.feed(text)
    if not text.lstrip().lower().startswith("<!doctype html>"):
        report.error(rel, "HTML5-Doctype fehlt")
    if not parser.lang:
        report.error(rel, "lang-Attribut am html-Element fehlt")
    if not parser.title.strip():
        report.error(rel, "title fehlt oder ist leer")
    if not parser.has_viewport:
        report.error(rel, "meta viewport fehlt")
    if parser.h1 != 1:
        report.warn(rel, f"{parser.h1} h1-Ueberschriften (erwartet: genau eine)")
    for line in parser.images_without_alt:
        report.error(rel, "img ohne alt-Attribut", line)
    for line in parser.frames:
        report.error(rel, "iframe, embed oder object eingebunden (externe Inhalte nur nach Pruefung)", line)
    for line in parser.inline_handlers:
        report.warn(rel, "Inline-Ereignisbehandlung (on...=) erschwert eine strenge Content-Security-Policy", line)
    for ident, count in parser.ids.items():
        if count > 1:
            report.error(rel, f"id '{ident}' kommt {count}-mal vor")
    for tag, url, line in parser.resources:
        if is_external(url):
            report.error(rel, f"externe Ressource in <{tag}>: {url}", line)
        elif not url.startswith(("data:", "#")):
            target = resolve_local(page, url)
            if target is not None and not target.exists():
                report.error(rel, f"Ressource nicht gefunden: {url}", line)
    for href, line in parser.links:
        if href.startswith(("mailto:", "tel:")) or is_external(href):
            continue
        if href.startswith("#"):
            anchor = href[1:]
            if anchor and anchor not in parser.ids:
                report.error(rel, f"Sprungziel fehlt: {href}", line)
            continue
        target = resolve_local(page, href)
        if target is not None and not target.exists():
            report.error(rel, f"Link-Ziel nicht gefunden: {href}", line)
    status = parser.release_status
    noindex = "noindex" in parser.robots
    if status == "draft" and not noindex:
        report.error(rel, "Entwurf ohne meta robots noindex")
    if status == "released" and noindex:
        report.note(rel, "freigegebene Seite mit noindex; nur fuer eine Vorabseite gewollt")
    if status == "draft":
        if release:
            report.error(rel, "Seite ist als Entwurf markiert (meta release-status=draft)")
        else:
            report.note(rel, "Entwurf (meta release-status=draft); ein Deployment ist so nicht moeglich")
    if release:
        for line in parser.placeholders:
            report.error(rel, "Platzhalter (data-placeholder/data-open) im Freigabestand", line)
        for match in OPEN_MARKER.finditer(text):
            report.error(rel, "offene Angabe [OFFEN ...] im Freigabestand", line_of(text, match.start()))
    return parser


# ---------------------------------------------------------------- Hauptpruefung

def check_files(report: Report, denylist, release: bool) -> None:
    files, special = list_files()
    for rel in REQUIRED_FILES:
        if not (ROOT / rel).is_file():
            report.error(rel, "Pflichtdatei fehlt")
    if (ROOT / ".gitmodules").exists():
        report.error(".gitmodules", "Submodule sind nicht zulaessig")
    for rel in sorted(special):
        report.error(rel, "Symbolischer Link oder Submodul ist nicht zulaessig")
    for rel in files:
        path = ROOT / rel
        if path.is_symlink():
            report.error(rel, "Symbolischer Link ist nicht zulaessig")
            continue
        suffix = path.suffix.lower()
        size = path.stat().st_size
        if suffix in BLOCKED_EXTENSIONS:
            report.error(rel, f"Dateityp {suffix} ist im oeffentlichen Repository nicht zulaessig")
        limit = MAX_VIDEO_BYTES if rel.startswith(SITE) and suffix in VIDEO_EXTENSIONS else MAX_FILE_BYTES
        if size > limit:
            report.error(rel, f"Datei groesser als {limit // (1024 * 1024)} MB")
        elif size > WARN_FILE_BYTES:
            report.warn(rel, "Datei groesser als 1 MB; Komprimierung pruefen")
        in_site = rel.startswith(SITE)
        if in_site:
            name = Path(rel).name
            parts = Path(rel).parts
            hidden = any(p.startswith(".") for p in parts[1:]) and name != ".gitkeep"
            if hidden and not rel.startswith(SITE + ".well-known/"):
                report.error(rel, "versteckte Datei in site/")
            elif suffix not in SITE_EXTENSIONS and name != ".gitkeep":
                report.error(rel, f"Dateityp {suffix or '(ohne Endung)'} ist in site/ nicht vorgesehen")
            if suffix == ".pdf":
                report.warn(rel, "PDF in site/: Inhalt, Metadaten und Freigabe manuell pruefen")
        text = read_text(path) if suffix in TEXT_EXTENSIONS or size < 512 * 1024 else None
        if text is None:
            continue
        scan(text, SECRET_PATTERNS, report, rel, "FEHLER", "moegliche Zugangsdaten")
        if rel != SELF:
            scan(text, LOCAL_PATH_PATTERNS, report, rel, "FEHLER", "lokaler Pfad")
            scan(text, INTERNAL_PATTERNS, report, rel, "FEHLER", "interne Kennung")
            scan(text, denylist, report, rel, "FEHLER", "Begriffsliste")
        if in_site:
            scan(text, SITE_ONLY_PATTERNS, report, rel, "FEHLER", "nicht zulaessig in site/")
            if suffix in {".html", ".htm"}:
                parser = check_html(rel, text, report, release)
                if rel == SITE + "index.html":
                    linked = {h.split("#")[0] for h, _ in parser.links}
                    for legal in LEGAL_PAGES:
                        if legal not in linked:
                            report.error(rel, f"Startseite verlinkt {legal} nicht")
            elif suffix == ".css":
                for match in CSS_EXTERNAL_PATTERN.finditer(text):
                    report.error(rel, "externe Ressource im CSS", line_of(text, match.start()))
            elif suffix in {".js", ".mjs"}:
                for match in JS_NETWORK_PATTERN.finditer(text):
                    report.warn(rel, "Netzwerkzugriff im JavaScript; Datenuebertragung pruefen",
                                line_of(text, match.start()))
    if release:
        for legal in LEGAL_PAGES:
            if not (ROOT / SITE / legal).is_file():
                report.error(SITE + legal, "Rechtliche Seite fehlt")


WORKFLOW_DIR = ".github/workflows/"
DEPLOY_WORKFLOW = WORKFLOW_DIR + "deploy-pages.yml"
USES_PATTERN = re.compile(r"^\s*-?\s*uses:\s*([^\s#]+)", re.MULTILINE)
PINNED_PATTERN = re.compile(r"@[0-9a-f]{40}$")
PAGES_ACTIONS = ("actions/deploy-pages", "actions/upload-pages-artifact")


def workflow_triggers(text: str) -> set[str]:
    """Liefert die Ausloeser unter dem obersten on:-Schluessel (Block- oder Listenform)."""
    lines = text.splitlines()
    for i, line in enumerate(lines):
        match = re.match(r"^(?:on|\"on\"|'on'):\s*(.*)$", line)
        if not match:
            continue
        inline = match.group(1).split("#")[0].strip()
        if inline:
            return {t.strip(" []'\"") for t in inline.split(",") if t.strip(" []'\"")}
        triggers = set()
        for follow in lines[i + 1:]:
            if follow.strip() == "" or follow.lstrip().startswith("#"):
                continue
            if not follow.startswith(" "):
                break
            key = re.match(r"^  (?:- )?([A-Za-z_]+)", follow)
            if key:
                triggers.add(key.group(1))
        return triggers
    return set()


def check_workflows(report: Report) -> None:
    """Workflows: Actions auf Commit-SHA, genau ein manuelles Pages-Deployment nur aus site/."""
    directory = ROOT / WORKFLOW_DIR
    if not directory.is_dir():
        return
    for path in sorted(directory.iterdir()):
        if path.suffix.lower() not in {".yml", ".yaml"}:
            continue
        rel = WORKFLOW_DIR + path.name
        text = read_text(path) or ""
        for match in USES_PATTERN.finditer(text):
            ref = match.group(1).strip("'\"")
            if ref.startswith(("./", "docker://")):
                continue
            if not PINNED_PATTERN.search(ref):
                report.error(rel, f"Action nicht auf vollstaendige Commit-SHA gepinnt: {ref}",
                             line_of(text, match.start()))
        if any(action in text for action in PAGES_ACTIONS) and rel != DEPLOY_WORKFLOW:
            report.error(rel, "weiterer Workflow mit Pages-Deployment; zulaessig ist nur " + DEPLOY_WORKFLOW)
    deploy = ROOT / DEPLOY_WORKFLOW
    if deploy.is_file():
        text = read_text(deploy) or ""
        triggers = workflow_triggers(text)
        if triggers != {"workflow_dispatch"}:
            report.error(DEPLOY_WORKFLOW, f"Ausloeser muessen genau workflow_dispatch sein, gefunden: "
                                          f"{', '.join(sorted(triggers)) or 'keine'}")
        if "check-public-content.py --release" not in text:
            report.error(DEPLOY_WORKFLOW, "Freigabepruefung (--release) fehlt")
        artifact_path = re.search(r"^\s*path:\s*['\"]?_site/?['\"]?\s*$", text, re.MULTILINE)
        if not artifact_path or "cp -R site _site" not in text:
            report.error(DEPLOY_WORKFLOW, "Artefakt wird nicht ausschliesslich aus site/ gebaut")


def check_history(report: Report, denylist) -> None:
    """Prueft alle Commits: hinzugefuegte Zeilen, Nachrichten und Autorenadressen."""
    try:
        log = git("log", "--all", "-p", "--no-color", "--no-ext-diff",
                  "--format=@@COMMIT %H%n@@AUTHOR %ae%n@@COMMITTER %ce%n%B").decode("utf-8", "replace")
    except (OSError, subprocess.CalledProcessError):
        report.warn("(Historie)", "Git-Historie nicht lesbar")
        return
    commit = "?"
    current = ""
    in_message = False
    for raw in log.splitlines():
        if raw.startswith("@@COMMIT "):
            commit = raw.split()[1][:10]
            current = ""
            in_message = True
            continue
        if raw.startswith(("@@AUTHOR ", "@@COMMITTER ")):
            email = raw.split(" ", 1)[1].strip()
            if not email.endswith("@users.noreply.github.com") and email != "noreply@github.com":
                report.warn(f"(Commit {commit})", f"Adresse ist keine GitHub-Noreply-Adresse: {email}")
            continue
        if raw.startswith("diff --git"):
            in_message = False
            current = raw.rsplit(" b/", 1)[-1]
            continue
        if in_message:
            line = raw
            where = f"(Commit {commit}, Nachricht)"
        elif raw.startswith("+") and not raw.startswith("+++"):
            line = raw[1:]
            where = f"(Commit {commit}, {current})"
        else:
            continue
        scan(line, SECRET_PATTERNS, report, where, "FEHLER", "moegliche Zugangsdaten")
        if current == SELF and not in_message:
            continue
        scan(line, denylist, report, where, "FEHLER", "Begriffsliste")
        scan(line, LOCAL_PATH_PATTERNS, report, where, "FEHLER", "lokaler Pfad")
        scan(line, INTERNAL_PATTERNS, report, where, "FEHLER", "interne Kennung")


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--release", action="store_true", help="Freigabepruefung fuer ein Deployment")
    parser.add_argument("--history", action="store_true", help="gesamte Git-Historie pruefen")
    parser.add_argument("--denylist", help="Pfad zu einer lokalen Begriffsliste ausserhalb des Repositorys")
    args = parser.parse_args()

    report = Report()
    denylist = load_denylist(args.denylist)
    check_files(report, denylist, args.release)
    check_workflows(report)
    if args.history:
        check_history(report, denylist)

    order = {"FEHLER": 0, "WARNUNG": 1, "HINWEIS": 2}
    for item in sorted(report.items, key=lambda f: (order[f.level], f.path, f.line)):
        where = f"{item.path}:{item.line}" if item.line else item.path
        print(f"{item.level:8} {where}  {item.message}")
    mode = ", ".join(m for m, on in (("Freigabe", args.release), ("Historie", args.history)) if on) or "Standard"
    deny = f"{len(denylist)} Begriffe" if denylist else "keine"
    print(f"\nModus: {mode}; Begriffsliste: {deny}; "
          f"{report.errors} Fehler, {sum(1 for f in report.items if f.level == 'WARNUNG')} Warnungen.")
    return 1 if report.errors else 0


if __name__ == "__main__":
    sys.exit(main())
