# GastroBoard — Website

Statische Seite. Kein Build, keine Paketverwaltung: Ordner auf einen Webspace
legen, fertig. Zum Ansehen auf dem eigenen Rechner braucht es einen kleinen
Server (siehe unten), weil die Pfade absolut sind.

---

## Die Gestaltungsidee

**Ein Küchentag läuft nach Uhrzeit.** Deshalb ist die Seite selbst ein
Ablaufplan: Links läuft eine Schiene mit Uhrzeiten mit, jeder Abschnitt ist
ein Posten im Tag — 14:00 Mise en place, 16:00 Einkauf, 17:30 Briefing,
18:00 Service, 23:00 Abschluss. Beim Scrollen füllt sich die Schiene, der
aktive Posten leuchtet auf.

Das ist kein Dekor: Die Module der App ordnen sich tatsächlich einem
Serviceablauf zu. Nummerierung oder Uhrzeiten sind nur dann sinnvoll, wenn
die Reihenfolge etwas Wahres über den Inhalt sagt — hier tut sie das.

### Material und Farbe

Grundfläche ist **gebürsteter Edelstahl** (`#C6CCC6`) — die Oberfläche, auf
der in jeder Profiküche gearbeitet wird. Erzeugt wird sie mit zwei feinen
Linienrastern in CSS, kein Bild.

Bewusst *nicht* verwendet: cremeweißer Hintergrund mit Serifenschrift und
Terrakotta-Akzent. Diese Kombination ist inzwischen der Standardgriff
generierter Seiten und wirkt austauschbar. Terrakotta bleibt als Markenfarbe
der App erhalten, aber sparsam: für Akzente und für den einen Moment, auf den
es ankommt.

### Schrift

| Rolle | Schrift | Warum |
|---|---|---|
| Überschriften | Archivo, breit laufend | Wirkt wie Beschriftung an Küchengeräten |
| Fließtext | IBM Plex Sans | Technisch, sachlich, sehr gut lesbar |
| Zeiten und Codes | IBM Plex Mono | Zahlen stehen untereinander, Codes bleiben lesbar |

Alle Schriften liegen im Ordner `fonts/` und werden **selbst ausgeliefert**.
Über Google Fonts eingebunden würde bei jedem Aufruf die IP-Adresse des
Besuchers an Google übertragen — in Deutschland ein bekanntes
Datenschutzproblem. Selbst gehostet entfällt das, und die Seite lädt schneller.

### Das Herzstück

Der Abschnitt **16:00 Einkauf** zeigt, was die App im Kern leistet: Drei
Rezepte brauchen Eier, die App legt sie zusammen. Beim Scrollen melden sich
die Rezepte nacheinander, die Zahl rechts zählt mit — 4, dann 6, dann 11.

Das ist die einzige Stelle mit einer aufwendigen Bewegung. Alles andere bleibt
ruhig. Ein starker Moment wirkt mehr als viele kleine Effekte.

---

## Aufbau

```
index.html            Startseite
css/style.css         Gestaltung, mit Kommentaren
js/main.js            Bewegung, mit Kommentaren
fonts/                Schriften (selbst ausgeliefert)
vendor/               GSAP, ScrollTrigger, Lenis, SplitType
assets/logo.svg       Logo und Favicon
datenschutz/ agb/ impressum/ cookies/ kontakt/
CNAME .nojekyll robots.txt
```

Die Rechtsseiten liegen als Ordner mit `index.html`, damit die Adressen ohne
Dateiendung funktionieren: `gastroboard.net/datenschutz` und so weiter. Genau
diese Adressen sind in der App unter **Konto → Rechtliches** hinterlegt.

## Die verwendeten Werkzeuge

| Werkzeug | Aufgabe |
|---|---|
| **GSAP** | Bewegungsabläufe, exakt steuerbar |
| **ScrollTrigger** | Verbindet Bewegung mit der Scrollposition |
| **Lenis** | Nimmt dem Mausrad die Härte, macht das Scrollen weich |
| **SplitType** | Zerlegt Überschriften in Zeilen, damit sie einzeln hervorfahren können |

Alle liegen in `vendor/` — keine Verbindung nach außen, die Seite läuft
vollständig offline.

**Wichtig:** Ohne JavaScript oder mit abgeschalteten Animationen ist die Seite
vollständig lesbar. Bewegung ist Zugabe, kein Fundament. Wer im System
„Bewegung reduzieren" aktiviert hat, bekommt die ruhige Fassung.

---

## Lokal ansehen

```bash
cd gb-site
python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen. Beenden mit `Strg + C`.

Ein Doppelklick auf `index.html` zeigt die Seite ohne Gestaltung — die Pfade
beginnen mit `/`, was nur auf einem Server funktioniert. Das ist Absicht,
damit die Unterseiten auf der Domain korrekt verlinken.

## Veröffentlichen

Den Inhalt des Ordners auf den Webspace legen (bei Strato in das
Verzeichnis der Domain). Bei GitHub Pages: Repository anlegen, Dateien
hochladen, unter *Settings → Pages* die Quelle auf `main` / `/ (root)`
stellen. Die Datei `CNAME` enthält die Domain bereits.

## Anpassen

- **Farben und Abstände**: oben in `css/style.css` unter `:root`
- **Texte**: direkt in `index.html`
- **App-Store-Link**: Sobald die App live ist, den Hinweis
  „Demnächst im App Store" durch einen echten Link ersetzen
- **Datum der Rechtstexte**: in jeder Unterseite in der Zeile `<p class="meta">`
