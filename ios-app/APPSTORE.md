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
| Privacy Policy URL | `https://benpohlbasel.github.io/deface/privacy.html` |

## Privacy Policy
Liegt im Repo unter `privacy.html` und ist live auf GitHub Pages erreichbar.
Sie deckt: nichts gesammelt, Bilder bleiben on-device, exakte Permission-
Begründung pro Aktion, gebündelte Third-Party-Libs (onnxruntime-web, YuNet,
Capacitor), Kinder, Änderungen, Open-Source-Quellen, Kontakt über Repo-Issues.

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

## Guideline 4.2 — Native Value (was an iOS-Eigenfunktionen drin ist)

**App-Identität & Look**
- Branded Splash Screen (dunkler Hintergrund + violettes Mosaik-Logo, 2732×2732 für alle Devices).
- Status-Bar im App-Farbton (`UIStatusBarStyleLightContent` + `@capacitor/status-bar` programmatisch).
- App-Icon mit eigenständigem Mosaik-Branding in allen iOS-Grössen (Source 1024).
- Edge-to-edge WebView (`contentInset: never` + `backgroundColor: #0d0e14`), Safe-Areas via CSS.

**Native Plugins (`@capacitor/*`)**
- **Camera** — `Load`-Button öffnet das native iOS-Sheet *Take Photo · Photo Library · Cancel*; echte Live-Kamera-Aufnahme im Workflow.
- **Share** + **Filesystem** — `Save`-Button öffnet das System-Share-Sheet (Save to Photos, AirDrop, Messages, Files …); Datei wird vorab in den App-Cache geschrieben.
- **Haptics** — Light Impact nach erfolgreicher Gesichtserkennung, Success Notification nach dem Sichern.
- **SplashScreen** — sanftes Fade-out (250 ms), kein abrupter Switch.
- **Browser** — externe Links (BIAS.CITY, GitHub, Privacy Policy) öffnen in einem `SFSafariViewController`, User bleibt im App-Kontext.

**Privacy & Berechtigungen**
- `NSPhotoLibraryUsageDescription`, `NSPhotoLibraryAddUsageDescription`, `NSCameraUsageDescription` mit nutzerverständlichen Begründungen.
- `PrivacyInfo.xcprivacy` deklariert: kein Tracking, keine Datenerhebung; Required-Reason-APIs (UserDefaults CA92.1, FileTimestamp C617.1, SystemBootTime 35F9.1, DiskSpace E174.1) korrekt für Capacitor/WebKit-Interna.
- Komplett offline-fähig — kein Server-Request zur Laufzeit, Modell ist im Bundle.

**On-device-Substanz**
- Gesichtserkennung **YuNet** (OpenCV Zoo, MIT) via **onnxruntime-web** (WASM, single-thread, iOS-Safari-tauglich) in einem **Web Worker, der nach jeder Erkennung terminiert** → kein wachsender WASM-Heap, Zoom bleibt stabil.
- 4000-px-Voll-Auflösung-Export, Arbeitsauflösung 2000 px für GPU-Speicher-Sparsamkeit.

## Accessibility (relevant für Review + App-Store-Description)

| Standard | Status | Wie umgesetzt |
|---|---|---|
| **VoiceOver-Labels** | ✓ | `aria-label` auf Sliders (Brush size, Brush edge, Secure scramble), auf der Canvas-Stage; `aria-label` auf Menu-/Info-/Load-/Save-Buttons; dekorative Overlays mit `aria-hidden="true"`. |
| **Tap-Targets ≥ 44 pt** (Apple HIG) | ✓ | Segment-Buttons (Pixel size, Tool) `min-height: 44px`; Top-Buttons Load/Save/Settings sind 46×46. |
| **Reduce Motion** | ✓ | `@media (prefers-reduced-motion: reduce)` deaktiviert alle Transitions auf 0.01 ms. |
| **Kontrast (WCAG AA)** | ✓ Text · ⚠ UI-Borders | Normaler Text ≥ 4.5 : 1 erfüllt. Ghost-Button-Borders bewusst dezent (~2 : 1) — Text in Buttons trägt die Lesbarkeit. |
| **Color-only-Information** | ✓ | Aktive Zustände kombinieren Farbe + Schriftgewicht + Hintergrundfüllung — nie nur Farbe. |
| **Dynamic Type** | ⚠ teilweise | Feste `px`-Schriftgrössen, kein Dynamic-Type-Mapping. (Optional Verbesserung.) |

In der App-Store-Description erwähnenswert:
> *Supports VoiceOver, Reduce Motion, and 44pt-minimum touch targets.*
