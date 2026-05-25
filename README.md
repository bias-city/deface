# Deface

A lightweight Progressive Web App for **pixelating (mosaicing) areas of an image** –
ideal for obscuring faces, license plates, or other sensitive details in photos.
Works fully **offline** and can be installed as a home-screen app on iPhone.

Everything runs locally in the browser – **no images are ever uploaded.**

## Features

- **Load an image** (JPG/PNG), automatically scaled to a max long edge of 4000 px.
- **Pixelate & erase** with one finger – the mosaic is revealed through a soft brush mask.
- **Pixel size** selectable (4 / 16 / 32 / 64 / 128).
- **Brush size** is image-relative (stays tied to image content while zooming) and the
  **brush edge** is adjustable (soft → hard radial falloff).
- **Live preview** of the actual pixelation under the cursor (desktop) plus a brush ring.
- **Zoom & pan**: two fingers on touch, trackpad pinch / mouse wheel on desktop.
- **Reset & fit**, and a fully collapsible menu. (To correct a region, switch the tool to *Erase*.)
- **Save**: share sheet on iOS/iPadOS ("Save to Photos"), direct download on desktop.
- **Offline-capable** via a service worker (cache-first).

## How it works

Plain HTML/CSS/JavaScript, no build step and no dependencies:

| File | Purpose |
|---|---|
| `index.html` | the whole app (UI + logic) |
| `sw.js` | service worker (offline cache of the app shell) |
| `manifest.webmanifest` | PWA manifest (name, icons, colors) |
| `icons/` | app icons (192 / 512 / maskable / Apple touch) |

Pixelation uses a few canvas layers: the full-resolution original, a mosaic stored at
**block resolution only** (one color per tile, scaled up sharply for display), and an
alpha mask kept at **reduced resolution** (upscaled smoothly so brush edges stay soft).
Keeping the mosaic and mask small – and dropping a heavy undo history in favor of the
eraser – keeps memory low enough to avoid the iOS canvas-memory limit during pinch-zoom.
Painting is throttled with `requestAnimationFrame`, and only the affected region is
recomposited – keeping the app smooth even on iPhone.

## Run locally

Any static server works, e.g.:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

> The service worker (and therefore offline support) only registers over
> **HTTPS** or `localhost`.

## Install on iPhone

1. Serve the app over **HTTPS** (e.g. GitHub Pages).
2. Open it in **Safari** → **Share** → **Add to Home Screen**.
3. The app then launches full-screen and works offline.

### Publish with GitHub Pages

In the repo **Settings → Pages**, set the source to the `main` branch (folder `/root`).
The app will then be available at `https://<user>.github.io/deface/`.

## License

[MIT](LICENSE) © 2026 Ben Pohl
