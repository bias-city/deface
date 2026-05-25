# Deface

Eine schlanke Progressive Web App zum **Verpixeln (Mosaik) von Bildbereichen** – ideal,
um Gesichter, Kennzeichen oder andere sensible Stellen auf Fotos unkenntlich zu machen.
Läuft komplett **offline** und lässt sich auf dem iPhone als Homescreen-App installieren.

Alles passiert lokal im Browser – **es werden keine Bilder hochgeladen.**

## Funktionen

- **Bild laden** (JPG/PNG), automatisch auf max. 4000 px lange Kante skaliert.
- **Verpixeln & Radieren** mit dem Finger (ein Finger) – Mosaik wird über eine weiche
  Pinselmaske sichtbar gemacht.
- **Pixel-Grösse** wählbar (4 / 16 / 32 / 64 / 128).
- **Pinselgrösse** bild-bezogen (bleibt beim Zoomen relativ zum Bildinhalt) und
  einstellbare **Pinselkante** (weicher → harter radialer Verlauf).
- **Live-Vorschau** der echten Verpixelung unter dem Cursor (Desktop) inkl. Pinselring.
- **Zoom & verschieben**: zwei Finger auf Touch, Trackpad-Pinch / Mausrad auf dem Desktop.
- **Undo, Reset, Anpassen** sowie ein vollständig ein-/ausblendbares Menü.
- **Sichern**: Teilen-Dialog auf iOS/iPadOS („In Fotos sichern"), direkter Download
  auf dem Desktop.
- **Offline-fähig** dank Service Worker (Cache-First).

## Technik

Reines HTML/CSS/JavaScript ohne Build-Schritt oder Abhängigkeiten:

| Datei | Zweck |
|---|---|
| `index.html` | komplette App (UI + Logik) |
| `sw.js` | Service Worker (Offline-Cache der App-Hülle) |
| `manifest.webmanifest` | PWA-Manifest (Name, Icons, Farben) |
| `icons/` | App-Icons (192 / 512 / maskable / Apple-Touch) |

Die Verpixelung arbeitet mit mehreren Canvas-Ebenen: Original, vorberechnetes Mosaik
und eine reine Alpha-Maske. Gemalt wird rAF-gedrosselt; nur der betroffene Bildbereich
wird neu zusammengesetzt – das hält die App auch auf dem iPhone flüssig.

## Lokal starten

Ein beliebiger statischer Server genügt, z. B.:

```bash
python3 -m http.server 8000
# danach http://localhost:8000 öffnen
```

> Der Service Worker (und damit der Offline-Betrieb) registriert sich nur über
> **HTTPS** oder `localhost`.

## Auf dem iPhone installieren

1. Die App über **HTTPS** ausliefern (z. B. GitHub Pages).
2. In **Safari** öffnen → **Teilen** → **Zum Home-Bildschirm**.
3. Die App startet danach im Vollbild und funktioniert offline.

### Mit GitHub Pages veröffentlichen

In den Repo-**Settings → Pages** als Quelle den `main`-Branch (Ordner `/root`) wählen.
Die App ist dann unter `https://<user>.github.io/deface/` erreichbar.

## Lizenz

[MIT](LICENSE) © 2026 Ben Pohl
