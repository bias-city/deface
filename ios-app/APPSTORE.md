# App Store Connect — DeFace Privacy

Copy-paste-Vorlage für die Einreichung. Drei zentrale Botschaften, die Apple
gerne hört: **on-device**, **kein Upload**, **funktioniert offline**.

## App Information
| Feld | Wert |
|---|---|
| App Name | `DeFace Privacy` |
| Subtitle (≤30) | `Hide faces in photos · offline` |
| Bundle ID | `city.bias.deface` (oder dein finaler) |
| Primary Category | Photo & Video |
| Secondary Category | Utilities |
| Age Rating | 4+ |
| Pricing | Free |

## Description (≤4000 Zeichen)
```
DeFace Privacy lets you anonymize faces (and any other sensitive area) in a
photo with a single tap — fully on your device. No upload, no account, no
tracking. The app works offline.

Highlights
• Automatic face detection runs locally with YuNet (no internet required).
• Refine with a soft pixelation brush: adjust block size, hardness, and the
  optional "Secure scramble" that locally reshuffles tiles to defeat naive
  un-pixelation matching.
• Sharper than your camera roll: editing happens at high resolution, the
  exported JPEG re-decodes the original at full quality.
• Save back to Photos through the system share sheet, or send anywhere else.
• Truly private by design — the image bytes never leave your iPhone.

Open source under the MIT License. The bundled face-detection model (YuNet,
OpenCV Zoo) is also MIT.
```

## Promotional Text (≤170 Zeichen, ohne Re-Review änderbar)
```
Hide faces in your photos — on-device, offline, no upload. Automatic face
detection plus a precision brush, with a strong "Secure scramble" mode.
```

## Keywords (≤100 Zeichen, komma-getrennt, ohne Spaces)
```
face,pixelate,privacy,blur,anonymize,mosaic,redact,offline,GDPR,photo,hide,blackout
```

## URLs
| Feld | Wert |
|---|---|
| Support URL | `https://github.com/BenPohlBasel/deface` |
| Marketing URL | `https://benpohlbasel.github.io/deface/` |
| Privacy Policy URL | Pflicht — siehe „Privacy Policy" unten |

## Privacy Policy
Apple verlangt eine erreichbare URL. Da wir nichts sammeln, reicht eine kurze
Seite. Vorschlag: in den GitHub-Pages-Ordner eine `privacy.html` legen mit:

```
DeFace Privacy collects no personal data. The app processes images entirely
on your device. No data, image, or analytics is sent to any server. Face
detection runs locally; the model is bundled in the app. The app does not
contain advertising, trackers, or third-party SDKs that collect personal data.
Contact: <your email>.
```

URL wäre dann z. B. `https://benpohlbasel.github.io/deface/privacy.html`.

## App Privacy (im App-Store-Connect-Formular)
- **Data Used to Track You** → *None*
- **Data Linked to You** → *None*
- **Data Not Linked to You** → *None*
- *„Data is collected"* → **No**

## Review-Notizen (für Apple-Reviewer)
Im Review-Submission-Formular gibt es ein „Notes"-Feld. Hilfreich:
```
This is a privacy utility that pixelates faces and other regions in a photo,
entirely on-device. There is no network usage at runtime — please disable
network on the test device, you will see all features work. The on-device
face detection model (YuNet, OpenCV Zoo, MIT) is bundled in the app.
No account/login is required. Image bytes never leave the device.
```

## Guideline 4.2 — was an „Native Value" schon drin ist
- Splash Screen mit eigenem Branding (dunkler Hintergrund + Mosaik-Logo).
- Statusbar im App-Farbton (UIStatusBarStyleLightContent).
- `NSPhotoLibrary` / `NSPhotoLibraryAdd` / `NSCameraUsageDescription` korrekt
  begründet im Info.plist.
- Privacy Manifest (`PrivacyInfo.xcprivacy`) deklariert „keine Tracking-APIs"
  und die Required-Reason-APIs, die Capacitor/WebKit intern nutzt.
- Voll offline lauffähig (Web-Assets gebündelt).
- On-device-Inferenz mit WebAssembly im Web Worker.

Optionale nächste native Schritte (für extra Polish):
- `@capacitor/share` für robustes natives Share-Sheet.
- `@capacitor/camera` für „Take Photo to anonymize" als zusätzliche Quelle.
- `@capacitor/haptics` für Feedback bei „Find faces" und „Save".
