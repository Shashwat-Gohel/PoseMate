# PoseMate

PoseMate is an Expo SDK 58 and React Native mobile application that helps users recreate photography poses with a reference image over the live camera preview.

## MVP workflow

1. Select a reference photo.
2. Open the live camera.
3. Align the subject with the reference overlay.
4. Adjust the overlay and capture a clean photo without the overlay.

## Development

```bash
npm install
npm run typecheck
npm start
```

Use Expo Go where supported, or a development build for native camera testing. Camera and photo-library behavior must be verified on a physical iPhone.

## iOS release builds

The configured iOS bundle identifier is `com.posemate.app`. Install EAS CLI and authenticate before building:

```bash
npm install --global eas-cli
eas login
eas build:configure
eas build --platform ios --profile development
eas build --platform ios --profile preview
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

The development profile creates an internal development build, while preview creates an internal distribution build. Test camera permissions, reference selection, overlay controls, capture, and gallery saving in the standalone build before submitting.

## Known release limitations

- A physical iPhone and Apple Developer account are required for standalone iOS builds.
- Camera, gallery, flash, and photo-saving behavior cannot be fully validated in a web browser or simulator.
- App icon and splash artwork still need final branded PNG assets before App Store submission.
- Core capture works offline and does not require an account, backend, API key, or network connection.

## Project structure

- `app/` — Expo Router screens and navigation.
- `components/` — reusable UI components.
- `constants/` — shared theme and design tokens.
- `idea.md` — product brief.
- `todo.md` — implementation checklist and progress log.

## Scope rule

The first release prioritizes the reliable camera-overlay workflow. AI analysis, accounts, backend services, subscriptions, and social features are future work.
