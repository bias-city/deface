# DeFace Privacy — iOS Wrapper

Wraps the parent PWA (`../`) into a native iOS app using **Capacitor**
(WKWebView). The web assets are **bundled** into the IPA, so the app
runs fully offline and never contacts a server.

- **Bundle Identifier**: `city.bias.deface`
- **App name**: `DeFace Privacy`
- **Display name** on the home screen: `DeFace` (set via Xcode →
  `CFBundleDisplayName` after `cap add ios`)

## Prerequisites

- Node.js ≥ 18 and npm
- Xcode ≥ 15 with command-line tools
- CocoaPods (Capacitor needs it): `sudo gem install cocoapods` or
  `brew install cocoapods`
- An Apple Developer account signed into Xcode

## First-time setup (after cloning)

```bash
cd ios-app
npm install              # installs Capacitor
./sync-www.sh            # copies the PWA assets into www/
npx cap add ios          # generates the ios/App/ Xcode project
npx cap sync ios         # installs CocoaPods and copies www/ into the iOS app
npx cap open ios         # opens Xcode
```

In Xcode:

1. Select the `App` target → **Signing & Capabilities** → choose your Team.
2. Update `Info.plist` if not already present (see below).
3. Pick a simulator or your iPhone, hit Run.

## Required `Info.plist` entries

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>DeFace needs access to your photos so you can choose an image to anonymize.</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>DeFace saves the anonymized image back to your photo library.</string>
```

Plus `CFBundleDisplayName = DeFace` for a short name under the icon.

## Updating after changes to the PWA

```bash
npm run sync             # = ./sync-www.sh && npx cap sync ios
```

Then rebuild in Xcode. No need to re-run `cap add ios`.

## Notes

- The Service Worker (`sw.js`) is bundled but typically does **not** register on
  Capacitor's `capacitor://` scheme. That is harmless — the whole app is already
  bundled offline.
- Face detection (YuNet via onnxruntime-web in a Web Worker) works in WKWebView;
  the worker terminates after each run to keep memory low.
- For App Store review, consider adding native bridges later
  (`@capacitor/share`, native PHPicker via plugin) to elevate the app above a
  pure WebView wrapper per Apple guideline 4.2.
