# PoseMate 📸
> **Recreate the shots you love — with confidence, precision, and zero guesswork.**

PoseMate is an iOS and Android camera studio built with React Native and Expo (SDK 58). It helps photographers, creators, couples, and travelers effortlessly recreate their favorite photography poses using a real-time viewfinder overlay.

---

## 💡 Why PoseMate Exists (The Problem & The Vision)

Have you ever saved a stunning photo on Pinterest or Instagram, visited a picturesque spot, handed your phone to a friend or partner, and asked:
> *"Can you take a picture of me doing this exact pose?"*

...only to end up with 40 awkward shots, wrong angles, miscommunicated postures, and frustration?

### The Core Frustration:
- **Posing Anxiety**: Most people freeze in front of a camera and don't know where to place their hands, how to angle their shoulders, or how to stand naturally.
- **Communication Gap**: Describing a posture, head tilt, or camera perspective to someone else (*"tilt down a bit... no, move left... lower the angle"*) is difficult and time-consuming.
- **Lost Moments**: By the time you get the angle right, the lighting has shifted, people feel uncomfortable, and the candid energy is gone.
- **AI Gimmicks Aren't the Answer**: People don't want synthetic AI avatars or generated faces — they want **real photos of themselves** in the natural setting, looking their best.

---

## ✨ How PoseMate Solves This

PoseMate eliminates the guesswork by turning your reference photo into a **live visual stencil directly over your camera viewfinder**:

1. **Import Any Inspiration**: Bring any photo from your gallery, Pinterest screenshot, or magazine editorial.
2. **Ghost Viewfinder Stencil**: The reference floats as a semi-transparent guide over the live camera preview.
3. **Pinch, Zoom & Align**: Scale, nudge, flip, rotate, or lock the reference to align body silhouettes, eye levels, and horizons perfectly.
4. **Camera Hardware Zoom**: Switch between `1×`, `2×`, and `3×` optical/digital zoom lenses on the fly.
5. **Clean Shutter Capture**: When you tap the shutter, PoseMate captures a pure, unblemished photograph — **the overlay is completely excluded from the captured image**.
6. **Save to Camera Roll**: Review your shot and save it directly to your device Photos library.

---

## 🔒 100% Private & Offline by Design

- **Zero Cloud Uploads**: Photos and camera streams are computed entirely on-device on local silicon.
- **No Sign-Up or Accounts**: No subscriptions, no tracking, and no internet connection required.
- **Full User Control**: Grant or revoke camera and photo library access anytime through the in-app settings or system preferences.

---

## 📱 User Workflow

```
[ Choose Reference Photo ]
            │
            ▼
[ Live Camera Viewfinder ] ──► Overlay reference with adjustable opacity & scale
            │
            ▼
[ Align Subject to Pose ] ──► Check posture, eye lines, framing & camera zoom
            │
            ▼
[ Snap Clean Photo ] ────────► Capture sensor frame without overlay
            │
            ▼
[ Save to Camera Roll ] ─────► Export directly to device gallery
```

---

## 🚀 Development & Setup

### Prerequisites
- Node.js (v20+ recommended)
- Physical iOS or Android device (recommended for camera and media library verification)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/Shashwat-Gohel/PoseMate.git
cd PoseMate

# Install dependencies
npm install

# Run TypeScript checks
npm run typecheck

# Start Expo development bundler
npm start
```

Use **Expo Go** or run `npm run ios` / `npm run android` for a native development build.

---

## 📦 iOS Release Builds (EAS)

The bundle identifier is configured as `com.posemate.app`.

```bash
# Install EAS CLI and authenticate
npm install --global eas-cli
eas login

# Build standalone binaries
eas build --platform ios --profile development
eas build --platform ios --profile preview
eas build --platform ios --profile production
```

---

## 📁 Project Architecture

- `app/` — Expo Router screen routes:
  - `index.tsx`: Studio home, reference asset drawer, and photo picker.
  - `camera.tsx`: Live viewfinder, multi-touch PanResponder overlay controls, and shutter engine.
  - `preview.tsx`: Clean frame inspector and camera roll export.
  - `settings.tsx`: On-device privacy, permissions management, and hardware channels.
- `components/` — Reusable UI components & error boundaries.
- `constants/theme.ts` — Apple iOS design tokens and camera palette.
- `idea.md` — Original product concept and user experience specifications.
- `todo.md` — Release milestones, architecture audit, and QA checklist.

---

## 📄 License

MIT © [Shashwat Gohel](https://github.com/Shashwat-Gohel)
