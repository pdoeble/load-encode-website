# DNS bei netcup für GitHub Pages

Ziel: Die Website ist unter `https://load-encode.de` erreichbar, und
`https://www.load-encode.de` leitet dorthin weiter. Die Werte und Zitate
stammen aus der Dokumentation von GitHub und netcup, abgerufen am 10.10.2026.
Vor der Umsetzung sind sie erneut zu prüfen.

## Stand

Am 10.10.2026 war `load-encode.de` laut DENIC nicht registriert
(`whois.denic.de`: „Status: free“; alle Abfragen lieferten NXDOMAIN). Nach der
Registrierung legt netcup eine Standardzone an. Diese Zone wird vor jeder
Änderung vollständig abgefragt und dokumentiert (Schritt 1).

**Keine DNS-Änderung, solange keine Veröffentlichung freigegeben ist.** Die
Domainverifizierung (Schritt 2) ist davon ausgenommen; sie macht nichts
öffentlich und schützt die Domain vor Übernahme durch Dritte.

## Schritt 1: Bestehende Zone festhalten

1. netcup Customer Control Panel → „Domains“ → Lupe neben `load-encode.de` →
   Reiter „CloudDNS“ (bei älteren Domains heißt der Reiter „DNS“).
2. Alle Einträge abschreiben oder als Bildschirmfoto im internen Bereich
   ablegen, nicht in diesem Repository.
3. Zur Gegenprobe von außen, je Typ einzeln:

   ```sh
   nslookup -type=A load-encode.de 1.1.1.1
   nslookup -type=AAAA load-encode.de 1.1.1.1
   nslookup -type=MX load-encode.de 1.1.1.1
   nslookup -type=TXT load-encode.de 1.1.1.1
   nslookup -type=CNAME www.load-encode.de 1.1.1.1
   ```

Einträge für E-Mail werden nicht verändert. Bei netcup-Webhosting mit Mail
sind das typischerweise:

| Host | Typ | Wert |
| --- | --- | --- |
| `@` | MX | `mail.load-encode.de` (Priorität 10), `mx1.netcup.net` (Priorität 50) |
| `@` | TXT | `v=spf1 mx a include:_spf.webhosting.systems ~all` |
| `key1._domainkey`, `key2._domainkey` | CNAME | Ziele unter `webhosting.systems` |

Ob die Zone nach der Registrierung tatsächlich solche Einträge enthält, zeigt
erst Schritt 1. Ein vorhandener A-Record für `mail` bleibt ebenfalls stehen.

## Schritt 2: Domain bei GitHub verifizieren

Die Verifizierung verhindert, dass ein fremdes GitHub-Konto die Domain oder ihre
direkten Subdomains für eigene Pages-Seiten nutzt. GitHub empfiehlt, sie vor dem
Eintragen der Domain im Repository vorzunehmen.

1. GitHub → Profilbild → Settings → „Pages“ → „Add a domain“ →
   `load-encode.de` eingeben. Bei einer Organisation stattdessen in den
   Organisationseinstellungen; das darf nur ein Organisationsinhaber.
2. GitHub zeigt einen TXT-Eintrag. Bei netcup anlegen:

   | Host | Typ | Wert |
   | --- | --- | --- |
   | `_github-pages-challenge-<konto>` | TXT | Prüfcode aus dem GitHub-Dialog |

   `<konto>` ist der Name des Kontos oder der Organisation, die das
   Repository besitzt (derzeit `pdoeble`). netcup erwartet den Host relativ zur
   Zone, also ohne `.load-encode.de`.
3. Prüfen, dann in GitHub „Verify“ wählen:

   ```sh
   nslookup -type=TXT _github-pages-challenge-<konto>.load-encode.de 1.1.1.1
   ```

4. Den TXT-Eintrag dauerhaft stehen lassen. GitHub: „To make sure your custom
   domain remains verified, keep the TXT record in your domain's DNS
   configuration.“

Wird das Repository später an eine Organisation übertragen, muss die
Organisation die Domain selbst verifizieren (eigener TXT-Eintrag mit ihrem
Namen). Die persönliche Verifizierung wird vorher entfernt, weil eine Domain
nur für ein Konto verifiziert sein kann.

## Schritt 3: Domain im Repository eintragen

Erst nach der Freigabe zur Veröffentlichung und nach Einrichtung von GitHub
Pages ([deployment.md](deployment.md)):

- Settings → Pages → „Custom domain“: `load-encode.de` → Save, oder
- `gh api -X PUT repos/<eigentümer>/load-encode-website/pages -f cname=load-encode.de`

GitHub verlangt diese Reihenfolge ausdrücklich vor der DNS-Konfiguration:
„Make sure you add your custom domain to your GitHub Pages site before
configuring your custom domain with your DNS provider.“ Eine Datei `CNAME`
im Repository ist beim Deployment über GitHub Actions nicht nötig: „If you are
publishing from a custom GitHub Actions workflow, no `CNAME` file is created,
and any existing `CNAME` file is ignored and is not required.“

## Schritt 4: DNS-Einträge für die Website

Zuerst Standardeinträge von netcup entfernen, die auf `@`, `www` oder `*`
zeigen und nicht zur Mail gehören (etwa A-Records einer Parkseite). GitHub:
„If your DNS provider automatically sets a default record, remove it before
continuing.“ Wildcard-Einträge (`*`) werden ersatzlos entfernt, weil sie das
Risiko einer Domainübernahme erhöhen.

Dann anlegen:

| Host | Typ | Wert |
| --- | --- | --- |
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `@` | AAAA | `2606:50c0:8000::153` |
| `@` | AAAA | `2606:50c0:8001::153` |
| `@` | AAAA | `2606:50c0:8002::153` |
| `@` | AAAA | `2606:50c0:8003::153` |
| `www` | CNAME | `<konto>.github.io` |

Hinweise:

- Der CNAME zeigt auf `<konto>.github.io` ohne Repository-Namen und nicht auf
  eine `*.pages.github.io`-Adresse.
- netcup erlaubt keinen CNAME auf `@` und keinen CNAME neben anderen Einträgen
  desselben Hosts. Ein vorhandener A-Record für `www` muss deshalb zuerst weg.
- netcup bietet keine ALIAS- oder ANAME-Einträge an; für die Hauptdomain
  werden A- und AAAA-Einträge verwendet.
- Optional schränkt ein CAA-Eintrag die Zertifikatsausstellung ein. Wenn einer
  existiert, muss Let's Encrypt erlaubt sein: `@ CAA 0 issue "letsencrypt.org"`.
- TTL: In CloudDNS je Eintrag einstellbar. Für die Umstellung ist ein kurzer
  Wert (etwa 300 Sekunden) praktisch; danach kann er erhöht werden.

Laut netcup werden Änderungen „usually updated within about 10 minutes“; bis
alle Resolver weltweit den neuen Stand haben, können bis zu 48 Stunden
vergehen.

## Schritt 5: HTTPS

Sobald die DNS-Einträge sichtbar sind, beantragt GitHub automatisch ein
Zertifikat bei Let's Encrypt. Laut GitHub kann es bis zu einer Stunde dauern,
bis die Seite per HTTPS erreichbar ist, und bis zu 24 Stunden, bis „Enforce
HTTPS“ wählbar ist. Danach „Enforce HTTPS“ aktivieren:

```sh
gh api -X PUT repos/<eigentümer>/load-encode-website/pages -F https_enforced=true
```

Hängt die Ausstellung, die Domain in den Pages-Einstellungen entfernen und neu
speichern; das startet den Vorgang neu.

## Schritt 6: Prüfen

```sh
# DNS
nslookup -type=A load-encode.de 1.1.1.1
nslookup -type=AAAA load-encode.de 1.1.1.1
nslookup -type=CNAME www.load-encode.de 1.1.1.1

# Pages-Diagnose von GitHub
gh api repos/<eigentümer>/load-encode-website/pages/health

# Weiterleitung und Zertifikat
curl -sI http://load-encode.de        # erwartet: 301 auf https://load-encode.de/
curl -sI https://www.load-encode.de   # erwartet: 301 auf https://load-encode.de/
curl -sI https://load-encode.de       # erwartet: 200
```

Das Zertifikat lässt sich im Browser über das Schloss-Symbol prüfen
(Aussteller Let's Encrypt, Name `load-encode.de` und `www.load-encode.de`).

GitHub richtet die Weiterleitung von `www` auf die Hauptdomain selbst ein, wenn
`load-encode.de` als Custom Domain eingetragen ist und beide Einträge
existieren.

## DNSSEC

netcup bietet DNSSEC für `.de` an (Reiter „DNSSEC“ → „Activate DNSSEC“). Es
verträgt sich mit GitHub Pages, weil GitHub nur die Auflösung der Einträge
braucht. Die Aktivierung ist empfehlenswert, sobald die Zone stabil ist.

## Typische Fehler

| Symptom | Ursache | Abhilfe |
| --- | --- | --- |
| „Domain does not resolve to the GitHub Pages server“ | alte A-Records oder Parkseite noch aktiv | Standardeinträge entfernen, Verbreitung abwarten |
| Zertifikat wird nicht ausgestellt | zusätzliche A-, AAAA- oder CNAME-Einträge für `@` oder `www`; CAA ohne `letsencrypt.org` | Zone bereinigen, Domain in den Pages-Einstellungen neu speichern |
| `www` liefert Fehler | CNAME fehlt oder zeigt auf den Repository-Pfad | CNAME auf `<konto>.github.io` |
| Mail kommt nicht mehr an | MX- oder SPF-Eintrag beim Aufräumen gelöscht | Einträge aus Schritt 1 wiederherstellen |
| Seite nach Übertragung des Repositorys nicht erreichbar | Domain nur für das alte Konto verifiziert; Pages-Adressen werden bei Übertragungen nicht umgeleitet | Domain in der neuen Organisation verifizieren und neu eintragen |
| Fremde Seite unter einer Subdomain | Wildcard-Eintrag oder abgeschaltete Pages-Seite mit weiter bestehenden DNS-Einträgen | Wildcards entfernen; beim Abschalten DNS-Einträge mit entfernen |

## Quellen (Abruf 10.10.2026)

- GitHub Docs: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- GitHub Docs: [Verifying your custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- GitHub Docs: [Securing your GitHub Pages site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- GitHub Docs: [Troubleshooting custom domains and GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages)
- GitHub Docs: [Transferring a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository)
- netcup Helpcenter, Artikel zu CloudDNS und DNS-Einstellungen im Customer Control Panel
