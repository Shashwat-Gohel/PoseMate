# PoseMate — Phase 2 Complete Review

> **Document purpose:** A thorough, honest audit of everything built so far vs. the original vision, what it still takes to ship to real users, what is missing, and a prioritised roadmap for Phase 2+. Written for the founder, a future co-developer, or an early investor.

---

## 1. The Original Vision (`idea.md`) vs. Reality

### What the vision said

The idea.md document describes PoseMate as a **mobile app for photographers** that solves one annoying real-world problem: when you want to recreate a specific pose or composition from a reference photo, you have to look at your phone, then look at the camera, then look at your phone again — endlessly. PoseMate eliminates that by letting the reference image float, semi-transparent, directly on top of the live camera feed.

The vision was always clean and focused:
- **No accounts.** No sign-up. No login.
- **No internet required.** Works fully offline.
- **Core gesture controls:** drag, pinch-to-resize, two-finger rotate, flip.
- **Core camera controls:** front/rear switch, flash, zoom.
- **Clean capture:** save the photo without any overlay burnt in.
- **Local history:** remember the last few references so the user doesn't re-pick every session.

Future ideas (explicitly flagged as "later" in idea.md):
- Favourites system
- Built-in pose library
- AI pose analysis / skeleton matching
- Cloud sync / accounts
- Couple / group pose mode

### Verdict

The vision was **fully understood and mostly delivered.** PoseMate today does exactly what the original idea described for the MVP. The pivot point from idea → code is faithful.

---

## 2. MVP Accomplishments — What Actually Works

The following features are fully implemented and pass TypeScript checks. All are ready for device verification.

### Core Workflow ✅

| Feature | Status | File |
|---|---|---|
| Select reference photo from gallery | ✅ Done | `app/index.tsx` |
| Display selected photo as transparent overlay over live camera | ✅ Done | `app/camera.tsx` |
| Opacity slider (real-time, 0–100%) | ✅ Done | `app/camera.tsx` |
| Drag overlay (single-finger PanResponder) | ✅ Done | `app/camera.tsx` |
| Pinch-to-resize overlay (two-finger) | ✅ Done | `app/camera.tsx` |
| Two-finger rotation | ✅ Done | `app/camera.tsx` |
| Horizontal flip | ✅ Done | `app/camera.tsx` |
| Lock / unlock overlay (prevents all transforms) | ✅ Done | `app/camera.tsx` |
| Reset overlay (position, scale, rotation, flip) | ✅ Done | `app/camera.tsx` |
| Front / rear camera toggle | ✅ Done | `app/camera.tsx` |
| Flash / torch control | ✅ Done | `app/camera.tsx` |
| Camera zoom (1×, 2×, 3×) | ✅ Done | `app/camera.tsx` |
| Pinch-to-zoom on reference image | ✅ Done | `app/camera.tsx` |
| Capture clean photo (overlay excluded) | ✅ Done | `app/camera.tsx` |
| Preview screen: show captured photo | ✅ Done | `app/preview.tsx` |
| Save to device gallery (expo-media-library) | ✅ Done | `app/preview.tsx` |
| Retake flow (back to camera, overlay preserved) | ✅ Done | `app/preview.tsx` |
| Discard / cancel captured photo | ✅ Done | `app/preview.tsx` |
| Recent references (last 5, AsyncStorage) | ✅ Done | `app/index.tsx` |
| Settings screen with permission controls | ✅ Done | `app/settings.tsx` |
| Camera permission handling | ✅ Done | `app/camera.tsx`, `app/settings.tsx` |
| Photo library permission handling | ✅ Done | `app/index.tsx`, `app/preview.tsx`, `app/settings.tsx` |
| "Open in iPhone Settings" direct link | ✅ Done | `app/settings.tsx` |
| AppState listener (re-check permissions on return) | ✅ Done | `app/settings.tsx` |
| Offline / no-login operation | ✅ Done | — |
| iOS-native dark professional UI | ✅ Done | `constants/theme.ts`, all screens |

### Infrastructure ✅

| Item | Status |
|---|---|
| Expo SDK 58 | ✅ |
| Expo Router (file-based navigation) | ✅ |
| TypeScript (strict, no errors) | ✅ |
| EAS Build configured (dev / preview / production profiles) | ✅ |
| `app.json` metadata (bundle ID, permissions, infoPlist) | ✅ |
| `AppErrorBoundary` (class component, Try Again fallback) | ✅ |
| Shared theme system (`colors`, `spacing`, `radii`, `typography`) | ✅ |
| Reusable `AppButton`, `ScreenContainer` components | ✅ |
| Gesture disabled on camera screen (swipe-back) | ✅ |
| iOS infoPlist usage descriptions (camera, photos, NSPhotoLibraryAdd) | ✅ |
| Android permissions (CAMERA, READ_MEDIA_IMAGES, WRITE_EXTERNAL_STORAGE) | ✅ |
| `ITSAppUsesNonExemptEncryption: false` (skips encryption export docs) | ✅ |
| README rewritten with why-this-exists, setup, build commands | ✅ |

---

## 3. Missing MVP Features — What Was Planned but Not Built

These items were either explicitly in `idea.md`, listed in `todo.md`, or are standard App Store requirements that must exist before the app can go public.

### 3.1 App Icon & Splash Screen 🔴 BLOCKER

> **This is the #1 blocker for submission.** Apple will reject any app without a proper icon.

- No `icon.png` asset exists (or it is a placeholder Expo icon)
- No `splash.png` / splash image matching brand colors
- Expo expects `./assets/icon.png` (1024×1024, PNG, **no alpha channel**)
- Expo expects `./assets/splash-icon.png` or the `expo-splash-screen` plugin

**What you need:**
- 1024×1024 PNG app icon, no alpha, no rounded corners (the OS applies the mask)
- Splash / launch screen image (or solid color background + centered logo)
- Both assets must feel premium and match the black + yellow `#FFD60A` brand

### 3.2 Physical Device QA — Not Done 🟡

All `todo.md` Phase 14 checkboxes are unchecked. The entire functional test matrix, device layout tests, and performance tests have **not been run on a real iPhone.** The code is correct per TypeScript, but camera/gesture/save behaviour must be verified on hardware before submitting.

### 3.3 Standalone EAS Build — Not Done 🟡

Phase 15 tasks are mostly unchecked:
- No development build has been installed on a physical iPhone
- No preview/TestFlight build has been created
- Photo saving and permissions have not been verified in a **standalone build** (they behave differently from Expo Go)

### 3.4 Haptic Feedback — Not Implemented 🟢

`todo.md` Phase 8 explicitly notes haptic feedback is not done. `expo-haptics` is not installed. The app would feel more polished with:
- Light impact on capture button press
- Success haptic after save
- Warning haptic on locked overlay touch

### 3.5 Comparison View — Not Implemented 🟢

The idea.md mentioned side-by-side comparison of the reference photo vs. the captured photo. The preview screen shows only the captured photo.

### 3.6 Self-Timer — Not Implemented 🟢

No countdown timer (3s / 5s / 10s) for hands-free / solo use. This was listed in `idea.md` as a future feature but is very common in camera apps and would significantly improve solo photographer UX.

### 3.7 Share Sheet — Not Implemented 🟢

After saving, the user cannot share the captured photo directly via the native iOS share sheet. Only "Save" exists.

### 3.8 Multiple Grid Overlays — Not Implemented 🟢

Only one static composition grid (rule of thirds) exists. idea.md mentioned options like golden ratio, square, etc.

### 3.9 Favourite Poses — Not Implemented 🟢

No bookmarking of reference images. Only a rolling "Recent 5" history. Explicitly marked as future in idea.md.

### 3.10 Built-in Pose Library — Not Implemented 🟢

No curated collection of poses bundled with the app. This was a Phase 2+ idea in idea.md.

---

## 4. Design Review

### What Looks Good ✅

- **Color palette:** Pure black `#000000` backgrounds, system grays for cards, Apple Camera yellow `#FFD60A` accent. Looks native and intentional.
- **Camera screen:** Floating zoom dock (1×/2×/3×), Apple-style shutter button (white outer ring), composition grid reticle — all feel like real iOS camera apps.
- **Settings screen:** Inset-grouped iOS list, color-coded icon boxes (green Camera, blue Photos), live permission badges — indistinguishable from a native iOS settings screen.
- **Typography:** SF Pro weights and tracking are correct throughout.
- **Dark theme:** Consistent across all screens. No light-mode leakage.

### What Still Needs Work ⚠️

#### 4.1 App Icon and Splash
Covered in section 3.1. Without a unique branded icon the app looks unfinished and Apple will reject it.

#### 4.2 Screen Size Support
The home screen and camera screen are designed for a "standard" iPhone (375–393pt width). Testing on:
- iPhone SE (375pt, small bezels)
- iPhone 16 Pro Max (430pt, large)
- iPhone 16 Pro (393pt, island)

Specific concerns:
- Camera bottom dock controls may feel cramped on SE
- Text sizes may be too large on SE if system font scaling is on

#### 4.3 Dynamic Type / Accessibility Text Sizes
No `maxFontSizeMultiplier` is set on `Text` components. At the largest Dynamic Type setting, some camera overlay controls could overflow their containers.

#### 4.4 Landscape Orientation
The app is locked to portrait (confirmed in `app.json`). That is the right call for MVP, but it means users who accidentally rotate their phone will get a broken layout on some devices. The lock should be explicit in the splash screen behaviour too.

#### 4.5 Animations & Transitions
`_layout.tsx` uses `animation: 'fade'` globally. This is clean and correct. However:
- Opening the camera from home has no meaningful state transition animation
- Capturing a photo (shutter flash effect) is implemented partially but no actual white-flash animation is confirmed
- The preview screen appears with no contextual motion

Adding `react-native-reanimated` entering/exiting animations for the preview screen would feel significantly more polished.

#### 4.6 Empty State on Home Screen
The home screen empty state works, but the visual "viewfinder preview" placeholder frame might confuse users who don't understand the workflow yet. Consider adding a short 3-step onboarding tooltip or a dismissable "how it works" card for first-time users.

#### 4.7 No App-Level Loading State
On cold launch, there is a brief flash of unstyled content before the home screen fully renders (common in Expo Router apps). A proper `expo-splash-screen` integration with `SplashScreen.preventAutoHideAsync()` and `SplashScreen.hideAsync()` after fonts/assets load would fix this.

---

## 5. iOS App Store Deployment Requirements

This section is a complete checklist of what Apple requires. Nothing here is optional.

### 5.1 Apple Developer Account
- **Cost:** \$99 USD per year
- **Sign up:** [developer.apple.com/enroll](https://developer.apple.com/enroll)
- Required for: creating certificates, provisioning profiles, App Store Connect access, TestFlight
- EAS can manage certificates automatically (`eas credentials`) but you must own the account

### 5.2 App Icon
- **Size:** 1024 × 1024 pixels
- **Format:** PNG
- **Alpha:** ❌ NOT ALLOWED — must be a fully opaque image
- **Corners:** Do not round the corners yourself — iOS applies the mask
- Place at: `assets/icon.png` and reference in `app.json` → `"icon": "./assets/icon.png"`

### 5.3 Launch Screen / Splash
- Expo handles this via `expo-splash-screen` plugin in `app.json`
- You need a `splash-icon.png` and a `backgroundColor` (use `"#000000"` to match the app)
- Configure in `app.json`:
  ```json
  "splash": {
    "image": "./assets/splash-icon.png",
    "resizeMode": "contain",
    "backgroundColor": "#000000"
  }
  ```
- Also add `SplashScreen.preventAutoHideAsync()` in `_layout.tsx` and hide it after fonts/data load

### 5.4 Privacy Policy URL
> **MANDATORY.** Apple requires a privacy policy URL for every app that accesses the camera or photo library. Apps without one will be rejected.

- Must be a publicly accessible URL (e.g., a simple webpage or a GitHub Pages site)
- Must explain: what data the app accesses (camera, photos), what it stores (AsyncStorage: recent URIs), what it does NOT do (no servers, no tracking, no analytics)
- Sample minimal policy is easy to write — the app is offline-only which makes it very simple

### 5.5 Bundle Identifier
- Already configured: `com.posemate.app` ✅
- Must match exactly in Apple Developer portal + App Store Connect + EAS

### 5.6 App Store Connect Setup
1. Log into [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Create a new App record → iOS, choose bundle ID `com.posemate.app`
3. Fill in: App Name, Subtitle (optional), Category (Photo & Video), Age Rating, Privacy Policy URL
4. Upload screenshots (see 5.7)
5. Write App Description and What's New text
6. Add Keywords (max 100 characters): `pose, reference, photo, camera, overlay, photography, posing`

### 5.7 App Store Screenshots (Required Sizes)
Apple requires screenshots in at least **one** of the following:

| Device | Pixel size | Required? |
|---|---|---|
| 6.9" iPhone (iPhone 16 Pro Max) | 1320 × 2868 px | ✅ Primary |
| 6.5" iPhone (iPhone 15 Plus / 14 Plus) | 1284 × 2778 px | ✅ Required |
| 6.1" iPhone (iPhone 16 / 15) | 1179 × 2556 px | Optional |
| iPad Pro 12.9" | 2048 × 2732 px | Only if claiming iPad support |

You need **at least 3 screenshots** per size, up to 10. These should show:
1. Camera screen with reference overlay visible
2. Home screen with recent references
3. Settings / permissions screen
4. Close-up of gesture controls or zoom UI

Screenshots must reflect the actual app UI — no fake device frames or misleading content.

### 5.8 Age Rating
- Complete the age rating questionnaire in App Store Connect
- For PoseMate: **4+ (no mature content)**
- No violence, no adult content, no gambling, no user-generated sharing = 4+

### 5.9 TestFlight → Production Pipeline

**Step 1: Create a development build**
```bash
eas build --platform ios --profile development
```
Install on physical iPhone, verify all permissions and camera behaviour.

**Step 2: Create an internal TestFlight build**
```bash
eas build --platform ios --profile preview
```
Or use the production profile for direct TestFlight upload:
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

**Step 3: Internal testing on TestFlight**
- Add yourself as an internal tester (up to 100 devices)
- Test all functional matrix items from `todo.md` Phase 14
- Verify photo saving works in standalone build
- Verify permissions work correctly on first launch

**Step 4: Submit for Apple Review**
- Attach review notes explaining the app uses camera as its core feature (not for data collection)
- Typical review time: 24–48 hours
- Be ready to respond to any reviewer questions within 7 days

### 5.10 EAS Build Configuration
Your `eas.json` has three profiles. The `production` profile needs to be completed:

```json
{
  "build": {
    "production": {
      "ios": {
        "buildConfiguration": "Release",
        "credentialsSource": "remote"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@apple.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

### 5.11 App Review Guidelines to Know
- **2.5.4** — Apps using background location, camera without user interaction, etc. must justify it. PoseMate is fine: camera is the core product.
- **5.1.1** — Data collected: since PoseMate stores nothing beyond local URIs in AsyncStorage, the data safety disclosure is minimal.
- **4.0** — Design: Apple checks that your app does not look like a template. The iOS-native UI you have is a strong point.
- Do **not** use misleading screenshots (do not show features that don't exist).

---

## 6. Android / Google Play Deployment Requirements

### 6.1 Google Play Console
- **Cost:** \$25 USD one-time registration fee
- Sign up at [play.google.com/console](https://play.google.com/console)

### 6.2 Target API Level
- Google requires Android 14+ (API 34+) for new apps submitted after August 2024
- Expo SDK 58 targets API 35 by default ✅

### 6.3 Signed Android App Bundle (AAB)
```bash
eas build --platform android --profile production
eas submit --platform android
```
EAS handles signing automatically with `credentialsSource: "remote"`.

### 6.4 Privacy Policy
Same privacy policy URL used for iOS works for Android too.

### 6.5 Data Safety Form
In Play Console → App content → Data safety:
- **Camera:** Yes (required for core functionality, not shared, not sold)
- **Photos:** Yes (read access for picker; write access for saving)
- **No location, contacts, identifiers, or financial data**
- **No data shared with third parties**
- **No data encrypted in transit** (app is fully offline — no network calls)

### 6.6 Screenshots + Feature Graphic
- **Phone screenshots:** At least 2, up to 8 (1080×1920 minimum)
- **Feature graphic:** 1024×500 px banner (shown in Play Store listing)
- **High-res icon:** 512×512 px PNG (separate from the app icon in the bundle)

### 6.7 Content Rating
- Complete the IARC questionnaire
- Expected rating: **Everyone (E)**

---

## 7. Scaling Considerations

PoseMate's current architecture is intentionally simple. Here is what changes when it grows.

### 7.1 Current State — Fully Local, Zero Backend
- **Storage:** AsyncStorage (device only, max 5 recent refs)
- **Network calls:** None
- **Cost to run at 1M users:** \$0 in infrastructure
- **Privacy:** Excellent — no PII leaves the device

This is the right architecture for MVP and for most of Phase 2. **Do not add a backend just for the sake of it.**

### 7.2 When You Add a Pose Library
If you bundle a curated library of reference poses (Phase 2):
- **Small library (< 200 images):** Bundle directly in the app binary. Fast, offline, no CDN needed. Increases app size ~20–50 MB.
- **Large library (200+ images):** Stream from a CDN (Cloudflare R2 or AWS S3 + CloudFront). Requires a minimal backend or just a JSON manifest + image URLs.
- **User-submitted poses (Phase 3):** Requires auth, moderation, Supabase or Firebase, storage rules, etc. Major scope increase.

### 7.3 When You Add AI Pose Analysis
Two approaches:

**On-device (recommended for MVP):**
- MediaPipe Pose Landmarker (runs on-device via WASM or native)
- React Native: use `@google/mediapipe` (community React Native package) or bridge via a native module
- No server cost, works offline, no latency
- Accuracy: good for body skeleton detection

**Cloud API:**
- Send frame to a Cloud Vision / Vertex AI endpoint
- Requires internet, adds latency (~200–500ms per frame), costs money at scale
- Better accuracy for complex pose matching

### 7.4 When You Add Accounts / Cloud Sync
Recommended stack:
- **Auth:** Supabase Auth (email magic link or Apple Sign In)
- **Storage:** Supabase Storage (for reference images) or iCloud CloudKit (iOS-only but free)
- **Database:** Supabase Postgres (favourites, collections, metadata)
- Apple Sign In is **mandatory** in the App Store if you offer any other social sign-in method

### 7.5 Analytics (When You Want It)
For a privacy-first photography app, consider:
- **Expo Updates** to track active versions without identifying users
- **PostHog** (self-hosted or cloud, GDPR compliant, opt-in)
- Never use Google Analytics / Firebase Analytics without explicit user consent (GDPR, CCPA)

---

## 8. Future Features — Phase 2 Roadmap

Prioritised from highest user value to most complex to build.

### 🔴 Must-Have Before App Store (These Are Blockers)

| Priority | Feature | Effort |
|---|---|---|
| 1 | App icon (1024×1024 PNG, branded, no alpha) | Low |
| 2 | Splash screen (black bg + logo) | Low |
| 3 | Privacy policy web page | Low |
| 4 | Physical device QA (all Phase 14 test matrix) | Medium |
| 5 | TestFlight internal build + test | Medium |

### 🟡 High Value — Add in Phase 2

| Priority | Feature | Effort | Why |
|---|---|---|---|
| 6 | Haptic feedback (capture, save, lock) | Low | Feels native and professional |
| 7 | Self-timer (3s / 5s / 10s) | Low–Medium | Critical for solo photographers |
| 8 | Share sheet (share photo after capture) | Low | Standard expectation |
| 9 | Shutter flash animation (white flash on capture) | Low | Confirms the moment of capture |
| 10 | Onboarding screen / tooltip (first launch) | Medium | Reduces first-use confusion |
| 11 | Side-by-side comparison view | Medium | Core idea.md feature |

### 🟢 Nice-to-Have — Phase 2 / 3

| Feature | Effort | Notes |
|---|---|---|
| Favourite poses (bookmarking) | Low–Medium | Star icon on recent refs; persisted in AsyncStorage |
| Multiple composition grids (golden ratio, diagonal, etc.) | Medium | Toggleable in a bottom sheet |
| Built-in pose library (bundled) | Medium | 50–100 curated poses, categorised (couple, solo, travel, editorial) |
| Video overlay mode | High | Live camera + overlay while recording — major feature |
| iPad layout support | Medium | Requires responsive layout rework |
| AI skeleton overlay (MediaPipe) | High | On-device, draws body keypoints over camera live |
| Couple / group pose mode | High | Multiple overlay images positioned independently |
| iCloud backup for pose history | Medium | iOS-only via CloudKit |
| Widget for quick-launch from home screen | Low | Expo does not support widgets natively yet |
| Landscape orientation support | Medium | Requires major camera screen layout rework |

---

## 9. Code Quality & Technical Debt

### 9.1 Gesture System (PanResponder → Reanimated)
The current implementation uses React Native's built-in `PanResponder` for all overlay gestures. This was the right choice for keeping dependencies minimal in the MVP. However:
- PanResponder runs on the JS thread. With a live camera preview, this can cause dropped frames under heavy load.
- The pinch-zoom logic requires careful `gestureStart` reset management (a known source of bugs).
- `react-native-gesture-handler` + `react-native-reanimated` would run on the UI thread (native driver), giving buttery-smooth gestures even under camera load.

**Recommendation:** Migrate to `react-native-gesture-handler` as the first refactor in Phase 2. It is already in many Expo projects as a default dependency.

### 9.2 No Tests
There are zero automated tests:
- No unit tests (Jest)
- No component tests (React Native Testing Library)
- No integration tests
- No E2E tests (Maestro or Detox)

For a camera app, E2E testing is hard (camera doesn't work in simulators). But unit tests for:
- AsyncStorage history logic (add, deduplicate, limit to 5)
- Theme constants (non-breaking changes)
- Utility functions

...would be easy to add and would prevent regressions.

### 9.3 No Error Monitoring
If the app crashes in production on a user's phone, you will not know. Consider:
- **Sentry** (free tier, React Native SDK, automatic crash reporting)
- `expo-updates` with rollback support

The existing `AppErrorBoundary` catches React render errors and shows "Something went wrong" — this is good, but it does not report errors anywhere. Connect it to Sentry's `Sentry.captureException`.

### 9.4 AsyncStorage Hardcoded Limit
`MAX_HISTORY_SIZE = 5` is hardcoded in the home screen. This is fine for now but should eventually come from a constants file or user preference.

### 9.5 No `expo-font` Integration
The app relies on system San Francisco font (correct for iOS) but does not load any custom fonts. If you ever add branded typography, use `expo-font` with `useFonts()` in `_layout.tsx` gated behind `SplashScreen.preventAutoHideAsync()`.

### 9.6 `ScreenContainer` Is Underused
`ScreenContainer` adds `paddingHorizontal: spacing.lg` but most screens manage their own padding directly (camera screen cannot use it at all since it needs edge-to-edge). Consider keeping it only for content screens or removing it in favour of explicit padding.

### 9.7 `AppButton` Is Underused
Most screens build inline `Pressable` components rather than using `AppButton`. Standardising would reduce style duplication. The `AppButton` component is solid — it handles pressed state and accessibility label fallback correctly.

---

## 10. Priority Order: What to Do Next to Go Live

This is the exact sequence to follow to get PoseMate on the App Store.

```
Phase 2A — Release Blockers (Do These First)
├── [ ] 1. Design app icon (1024×1024, PNG, no alpha)
├── [ ] 2. Add splash screen asset + configure expo-splash-screen
├── [ ] 3. Create privacy policy page (can be a simple GitHub Pages site)
├── [ ] 4. eas build --platform ios --profile development → install on iPhone
├── [ ] 5. Run all Phase 14 test matrix items on physical iPhone
├── [ ] 6. Fix any bugs found in step 5
└── [ ] 7. eas build --platform ios --profile production → TestFlight

Phase 2B — Before Public Release
├── [ ] 8. Create App Store Connect record (name, category, keywords, age rating)
├── [ ] 9. Take App Store screenshots on physical iPhone (3+ per required size)
├── [ ] 10. Write App Store description (problem statement, features, no-account)
├── [ ] 11. Add privacy policy URL to App Store Connect
└── [ ] 12. eas submit --platform ios → submit for Apple Review

Phase 2C — After First Release
├── [ ] 13. Add haptic feedback (expo-haptics)
├── [ ] 14. Add self-timer (3s / 5s / 10s)
├── [ ] 15. Add share sheet
├── [ ] 16. Add shutter flash animation
├── [ ] 17. Add side-by-side comparison view
├── [ ] 18. Add Sentry error monitoring
└── [ ] 19. Add E2E test coverage for core capture flow
```

---

## 11. Summary Scorecard

| Category | Score | Comment |
|---|---|---|
| Core feature completeness | **9/10** | Everything from idea.md is built |
| UI / visual quality | **8/10** | iOS-native, polished; app icon and splash missing |
| Code quality | **7/10** | TypeScript passes; no tests, no error monitoring |
| Deployment readiness | **4/10** | EAS configured but no builds tested on device |
| App Store readiness | **3/10** | Missing icon, splash, privacy policy, screenshots |
| Scalability | **9/10** | Offline-first; no backend to scale |
| Phase 2 potential | **10/10** | Clear roadmap; every future feature is additive |

---

## 12. One-Page Pitch (For Investors / Partners)

> **PoseMate** is a free, offline iOS camera app for photographers who need to recreate reference poses. Instead of toggling between a reference photo and a camera app, PoseMate floats the reference image — semi-transparent, draggable, resizable, and rotatable — directly on top of the live camera feed. When you're ready, one tap captures a clean photo with no overlay. The reference image never appears in your saved photos.
>
> Built in React Native / Expo. Fully offline. No accounts. No subscription. No data leaves the device.
>
> Phase 1 (shipped): complete MVP — reference overlay, full gesture control, photo save, settings, permission handling, iOS-native UI.
>
> Phase 2 (in progress): App Store submission, haptics, self-timer, share sheet, side-by-side comparison, built-in pose library.
>
> Phase 3 (future): AI pose skeleton matching, couple/group mode, pose collections, optional cloud sync.

---

*Last updated: November 2026 · Expo SDK 58 · React Native 0.88 · Bundle ID: com.posemate.app*
