#!/usr/bin/env bash
# Kopiert die PWA-Web-Assets aus dem Repo-Root nach ios-app/www/ — die Quelle,
# die Capacitor anschliessend ins iOS-App-Bundle übernimmt.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$HERE/.."
DEST="$HERE/www"

rm -rf "$DEST"
mkdir -p "$DEST"

cp     "$ROOT/index.html"           "$DEST/"
cp     "$ROOT/manifest.webmanifest" "$DEST/"
cp     "$ROOT/sw.js"                "$DEST/"   # Service Worker registriert auf capacitor:// evtl. nicht – egal, Assets sind ohnehin gebundelt.
cp     "$ROOT/detect-worker.js"     "$DEST/"
cp -R  "$ROOT/icons"                "$DEST/"
cp -R  "$ROOT/ort"                  "$DEST/"
cp -R  "$ROOT/models"               "$DEST/"

echo "Web-Assets synchronisiert nach $DEST"
