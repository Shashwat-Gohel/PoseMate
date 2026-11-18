# PoseMate

PoseMate is an Expo and React Native mobile application that helps users recreate photography poses with a reference image over the live camera preview.

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

## Project structure

- `app/` — Expo Router screens and navigation.
- `components/` — reusable UI components.
- `constants/` — shared theme and design tokens.
- `idea.md` — product brief.
- `todo.md` — implementation checklist and progress log.

## Scope rule

The first release prioritizes the reliable camera-overlay workflow. AI analysis, accounts, backend services, subscriptions, and social features are future work.
