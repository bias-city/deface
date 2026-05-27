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
- **Find faces** (optional): on-device face detection (SCRFD via onnxruntime-web)
  stamps suggested mask blobs over detected faces; refine with paint/erase. Fully
  local — no upload. First use loads ~14 MB (engine + model), then cached offline.
- **Privacy modes** (*Standard* / *Secure*): see below.
- **Save**: share sheet on iOS/iPadOS ("Save to Photos"), direct download on desktop.
- **Offline-capable** via a service worker (cache-first).

## Privacy: pixelation is not unbreakable

Plain pixelation is just a low-pass average, so a pixelated face stays surprisingly
identifiable — even machine "de-pixelation" / face-matching can recover identity,
especially via the *parrot attack* (the attacker pixelates their own reference photos
the same way and matches). In a quick 1-NN test on the Olivetti faces (40 people, chance
2.5 %), even a **2×2** mosaic over the face reached ~48 % identification, and 8×8 reached
~85 %.

The **Secure** mode hardens the mosaic by **locally shuffling the tiles** (a random grid
offset plus swapping each tile with a nearby neighbour). Swaps are only allowed between
tiles of **similar hue** (compared by brightness-independent chromaticity), so the local
colour spectrum is preserved — light and dark *skin* tones swap freely (which destroys the
eye/mouth layout recognisers rely on), but green grass behind the face is never mixed in.
This keeps the palette natural while scrambling structure; it dropped 8×8 recognition from
~85 % to ~14 % in the test, and works best with **coarse blocks**.

Caveats: the shuffle is information-*preserving* (it only hides the arrangement, and the
colour histogram is unchanged), so a determined adversary could try to "un-jigsaw" it using
a smoothness prior. For a hard guarantee, **fully removing** the region (a solid opaque
block) is the only method that destroys the information and drops to chance level.

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

## Face detection (offline)

The optional *Find faces* button runs [SCRFD](https://github.com/deepinsight/insightface)
(`scrfd_2.5g`, ~3 MB, with keypoints) locally via
[onnxruntime-web](https://github.com/microsoft/onnxruntime) (WASM, single-thread for
iOS Safari). Both are self-hosted under `ort/` and `models/` (no CDN, no runtime
request to third parties). The image never leaves the device. Detected boxes are
enlarged ~18 % and stamped as ellipses into the mask as a starting point — correct
them with the brush / *Erase*.

The detection math (SCRFD distance-to-bbox decode, letterbox round-trip, NMS) is
verified by an isolated Node test before integration.

## License

[MIT](LICENSE) © 2026 Ben Pohl

Bundled third-party models/runtime keep their own licenses: onnxruntime-web (MIT),
SCRFD / InsightFace model (research use; check upstream terms before commercial use).
