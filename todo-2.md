# PoseMate — Phase 2 Implementation Todo

> **Purpose of this document:** A step-by-step implementation guide for every remaining Phase 2 feature. Each task is written to be unambiguous so an AI coding model can implement it without guessing. All exact file paths, existing function names, variable names, existing style names, package versions, and code patterns are specified.
>
> **Ground rules for every task:**
> - Never add new npm packages unless the task explicitly says "Install package: ...".
> - Run `npm run typecheck` after every task and fix all errors before moving on.
> - Never break the existing iOS dark theme: `colors.background = '#000000'`, accent = `'#FFD60A'`.
> - Every new `Pressable` must have an `accessibilityLabel` prop.
> - Never use class components. Use functional components with hooks only.
> - Never hardcode pixel colors — always import and use tokens from `constants/theme.ts`.

---

## Project State Snapshot

| Item | Value |
|---|---|
| Working directory | `C:/Users/hp/Desktop/PoseMate` |
| Expo SDK | 58.0.x |
| React Native | 0.88.1 |
| Bundle ID | `com.posemate.app` |
| EAS Project ID | `e2ba3bff-98e3-4ac2-8880-01dc54ba9336` |
| Main screens | `app/index.tsx`, `app/camera.tsx`, `app/preview.tsx`, `app/settings.tsx` |
| Layout | `app/_layout.tsx` |
| Theme | `constants/theme.ts` — exports `colors`, `typography`, `spacing`, `radii` |
| Components | `components/AppButton.tsx`, `AppErrorBoundary.tsx`, `ScreenContainer.tsx` |

---

## Task 1 — App Icon

**Status:** ✅ Done  
**Priority:** 🔴 BLOCKER (Apple will reject without it)  
**Files to change:** `app.json`, `assets/icon.png`

### What to do

1. Create or commission a 1024 × 1024 pixel PNG image. Design brief:
   - Black (`#000000`) background
   - Centered camera aperture / shutter icon in Apple Camera yellow (`#FFD60A`)
   - A faint semi-transparent ghost image silhouette overlapping the aperture, to represent "reference overlay"
   - No alpha channel (fully opaque)
   - No rounded corners (iOS applies the mask automatically)
   - Save as `assets/icon.png`

2. In `app.json`, inside the `"expo"` object, add at the top level (before `"ios"`):
   ```json
   "icon": "./assets/icon.png",
   ```

3. Verify `app.json` now has this structure:
   ```json
   {
     "expo": {
       "name": "PoseMate",
       "slug": "posemate",
       "version": "1.0.0",
       "orientation": "portrait",
       "userInterfaceStyle": "dark",
       "scheme": "posemate",
       "icon": "./assets/icon.png",
       ...
     }
   }
   ```

### Verification
- Run `npx expo config --type public` and confirm `"iconUrl"` is not null.
- No TypeScript check needed (not a code file).

---

## Task 2 — Splash Screen

**Status:** ✅ Done  
**Priority:** 🔴 BLOCKER  
**Files to change:** `app.json`, `assets/splash-icon.png`, `app/_layout.tsx`  
**No new packages needed** — `expo-splash-screen` is already a dependency of Expo Router.

### Step 2a — Create the splash asset

- Create `assets/splash-icon.png`: the PoseMate wordmark or camera icon, white or yellow, centered, on a transparent background, approximately 200 × 200 px.
- The background color will be supplied separately via `app.json`.

### Step 2b — Update `app.json`

Inside the `"expo"` object, add a `"splash"` section at the top level (after `"icon"`):

```json
"splash": {
  "image": "./assets/splash-icon.png",
  "resizeMode": "contain",
  "backgroundColor": "#000000"
},
```

### Step 2c — Update `app/_layout.tsx`

Current file:
```tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <AppErrorBoundary>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="camera" options={{ gestureEnabled: false }} />
        </Stack>
      </AppErrorBoundary>
    </>
  );
}
```

Replace the entire file content with:

```tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Prevent the splash from hiding until we explicitly hide it.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash after the first render (fonts/assets are synchronous in this app).
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <AppErrorBoundary>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="camera" options={{ gestureEnabled: false }} />
        </Stack>
      </AppErrorBoundary>
    </>
  );
}
```

### Verification
- Run `npm run typecheck` — must exit 0.
- `SplashScreen` is imported from `expo-splash-screen` which is already in the Expo SDK 58 dependency tree. No install needed.

---

## Task 3 — Privacy Policy Web Page

**Status:** ✅ Done  
**Priority:** 🔴 BLOCKER (Apple requires a URL for apps using camera/photos)  
**Files to change:** None in the app codebase — this is a separate web page.

### What to do

Create a minimal privacy policy at a public URL. Easiest approach: GitHub Pages.

1. Create a new public GitHub repository named `posemate-privacy`.
2. Create `index.html` in that repo with the following content (fill in the date):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PoseMate Privacy Policy</title>
  <style>
    body { font-family: -apple-system, sans-serif; max-width: 680px; margin: 60px auto; padding: 0 24px; color: #111; line-height: 1.7; }
    h1 { font-size: 28px; } h2 { font-size: 18px; margin-top: 32px; }
  </style>
</head>
<body>
  <h1>PoseMate Privacy Policy</h1>
  <p>Last updated: [DATE]</p>

  <h2>What PoseMate is</h2>
  <p>PoseMate is a camera overlay app for iOS. It lets you superimpose a reference photo over your live camera feed to help recreate poses and compositions.</p>

  <h2>Data we collect</h2>
  <p>PoseMate collects <strong>no personal data</strong>. The app works entirely offline. No data is transmitted to any server.</p>

  <h2>Camera access</h2>
  <p>PoseMate uses your device camera to show a live viewfinder. The camera feed is never recorded, stored, or transmitted. It is used only while the app is open and in the foreground.</p>

  <h2>Photo library access</h2>
  <p>PoseMate reads your photo library only when you explicitly tap "Choose from Photos" to select a reference image. PoseMate writes to your photo library only when you tap "Save Photo" after capturing an image. No photos are uploaded or shared.</p>

  <h2>Local storage</h2>
  <p>PoseMate stores the file paths of your five most recently used reference photos on your device using AsyncStorage. This data never leaves your device.</p>

  <h2>Third-party services</h2>
  <p>PoseMate does not use analytics, advertising, crash reporting, or any third-party SDKs that collect data.</p>

  <h2>Contact</h2>
  <p>Questions? Email: [YOUR EMAIL]</p>
</body>
</html>
```

3. Enable GitHub Pages for the repo (Settings → Pages → Source: main branch).
4. Your privacy policy URL will be: `https://[yourusername].github.io/posemate-privacy/`
5. Save this URL — you will enter it in App Store Connect.

---

## Task 4 — Haptic Feedback

**Status:** ✅ Done  
**Priority:** 🟡 High value  
**Files to change:** `app/camera.tsx`, `app/preview.tsx`  
**Install package:** `expo-haptics`

### Step 4a — Install

```bash
npx expo install expo-haptics
```

This installs the SDK 58-compatible version automatically.

### Step 4b — Update `app/camera.tsx`

At the top of `app/camera.tsx`, add this import after the existing imports:

```tsx
import * as Haptics from 'expo-haptics';
```

#### 4b-i — Haptic on shutter press (capture)

Find the existing `capturePhoto` async function:

```tsx
const capturePhoto = async () => {
  if (!cameraRef.current || !isCameraReady || isCapturing) return;
  setCaptureError(null);
  setIsCapturing(true);
```

Add a haptic impact **immediately after** the guard check and **before** `setCaptureError(null)`:

```tsx
const capturePhoto = async () => {
  if (!cameraRef.current || !isCameraReady || isCapturing) return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  setCaptureError(null);
  setIsCapturing(true);
```

#### 4b-ii — Haptic on lock/unlock overlay

Find the lock toggle Pressable in the JSX:

```tsx
<Pressable accessibilityLabel={overlayLocked ? "Unlock Pose" : "Lock Pose"} style={[styles.microToolButton, overlayLocked && styles.microToolActive]} onPress={() => setOverlayLocked((c) => !c)}>
```

Replace its `onPress` with:

```tsx
onPress={() => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  setOverlayLocked((c) => !c);
}}
```

#### 4b-iii — Haptic on reset overlay

Find the reset Pressable:

```tsx
<Pressable accessibilityLabel="Reset Pose Alignment" style={styles.microToolButton} onPress={resetOverlay}>
```

Replace its `onPress` with:

```tsx
onPress={() => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  resetOverlay();
}}
```

### Step 4c — Update `app/preview.tsx`

Add import at top after existing imports:

```tsx
import * as Haptics from 'expo-haptics';
```

Find the `savePhoto` async function. After `setSaved(true)`, add:

```tsx
const asset = await MediaLibrary.createAssetAsync(capturedUri);
if (asset) {
  setSaved(true);
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
} else {
```

### Verification
- Run `npm run typecheck` — must exit 0.
- `Haptics.ImpactFeedbackStyle.Medium`, `.Light` and `Haptics.NotificationFeedbackType.Success` are valid enum values in `expo-haptics`.

---

## Task 5 — Shutter Flash Animation

**Status:** ✅ Done  
**Priority:** 🟡 High value  
**Files to change:** `app/camera.tsx` only  
**No new packages needed** — uses React Native `Animated` from `'react-native'`.

### What it does
When the user presses the shutter button, a white `View` covering the entire viewfinder briefly flashes at full opacity, then fades out in ~200ms. This confirms the moment of capture visually, identical to the native iOS Camera app.

### Step 5a — Add Animated import

In `app/camera.tsx`, the first import line is:

```tsx
import { ActivityIndicator, AppState, Image, LayoutAnimation, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
```

Replace it with:

```tsx
import { ActivityIndicator, Animated, AppState, Image, LayoutAnimation, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
```

### Step 5b — Add Animated value state

In `CameraScreen()`, after the existing `useRef` declarations (after line `const gestureStart = useRef(...)`), add:

```tsx
const shutterFlashOpacity = useRef(new Animated.Value(0)).current;
```

### Step 5c — Add flash trigger inside `capturePhoto`

In the `capturePhoto` function, **after** the haptic call and **before** `setCaptureError(null)`:

```tsx
const capturePhoto = async () => {
  if (!cameraRef.current || !isCameraReady || isCapturing) return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  // Trigger shutter flash
  shutterFlashOpacity.setValue(1);
  Animated.timing(shutterFlashOpacity, {
    toValue: 0,
    duration: 220,
    useNativeDriver: true,
  }).start();
  setCaptureError(null);
  setIsCapturing(true);
  // ... rest of existing code unchanged
```

### Step 5d — Add flash overlay View inside the viewfinder JSX

Find this section in the JSX (the viewfinder block ends with `</View>` after the floating zoom dock):

```tsx
          {/* iOS Native Camera Zoom Pill Segment ... */}
          <View style={styles.floatingZoomDock}>
            ...
          </View>
        </View>
```

After the `floatingZoomDock` closing `</View>` and before the closing `</View>` of `viewfinder`, add:

```tsx
          {/* Shutter Flash Overlay */}
          <Animated.View
            pointerEvents="none"
            style={[styles.shutterFlash, { opacity: shutterFlashOpacity }]}
          />
```

### Step 5e — Add the style

In `StyleSheet.create({...})` at the bottom of `camera.tsx`, add this entry anywhere after `cameraPaused`:

```tsx
  shutterFlash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 99,
  },
```

### Verification
- Run `npm run typecheck` — must exit 0.
- `Animated.Value`, `Animated.timing`, `Animated.View` are all from `'react-native'` — no extra install.

---

## Task 6 — Self-Timer (3s / 5s / 10s)

**Status:** ✅ Done  
**Priority:** 🟡 High value  
**Files to change:** `app/camera.tsx` only  
**No new packages needed.**

### What it does
A timer icon button appears in the top bar. Tapping it cycles through: OFF → 3s → 5s → 10s → OFF. When the user presses the shutter with a timer active, a large countdown number is shown over the viewfinder and the photo is captured after the countdown ends.

### Step 6a — Add timer state

In `CameraScreen()`, after `const [isCapturing, setIsCapturing] = useState(false);`, add:

```tsx
const [timerSeconds, setTimerSeconds] = useState<0 | 3 | 5 | 10>(0);
const [timerCountdown, setTimerCountdown] = useState<number | null>(null);
const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
```

### Step 6b — Add timer cycling function

After `const cycleCameraZoom = () => {...}` function, add:

```tsx
const cycleTimer = () => {
  setTimerSeconds((prev) => {
    if (prev === 0) return 3;
    if (prev === 3) return 5;
    if (prev === 5) return 10;
    return 0;
  });
};
```

### Step 6c — Modify `capturePhoto` to support countdown

Replace the entire `capturePhoto` function with:

```tsx
const capturePhoto = async () => {
  if (!cameraRef.current || !isCameraReady || isCapturing) return;

  if (timerSeconds > 0 && timerCountdown === null) {
    // Start countdown
    setTimerCountdown(timerSeconds);
    let remaining = timerSeconds;
    timerRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimerCountdown(null);
        // Fire actual capture after countdown
        void fireCaptureNow();
      } else {
        setTimerCountdown(remaining);
      }
    }, 1000);
    return;
  }

  await fireCaptureNow();
};

const fireCaptureNow = async () => {
  if (!cameraRef.current || !isCameraReady || isCapturing) return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  shutterFlashOpacity.setValue(1);
  Animated.timing(shutterFlashOpacity, {
    toValue: 0,
    duration: 220,
    useNativeDriver: true,
  }).start();
  setCaptureError(null);
  setIsCapturing(true);
  try {
    const result = await cameraRef.current.takePictureAsync({ quality: 1 });
    if (!result?.uri) throw new Error('Capture returned no image.');
    setCapturedUri(result.uri);
    router.push({ pathname: '/preview', params: { capturedUri: result.uri } });
  } catch {
    setCaptureError('We could not capture the photo. Please try again.');
  } finally {
    setIsCapturing(false);
  }
};
```

### Step 6d — Cleanup timer on unmount

After the existing `useEffect` for AppState, add a new `useEffect`:

```tsx
useEffect(() => {
  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, []);
```

### Step 6e — Add timer button to the top bar JSX

Find the `<View style={styles.topActionsGroup}>` section in the JSX. It currently has flash and camera-flip buttons. Add the timer button **before** the flash button:

```tsx
<View style={styles.topActionsGroup}>
  {/* Timer Toggle */}
  <Pressable
    accessibilityLabel={timerSeconds === 0 ? 'Self-timer off' : `Self-timer ${timerSeconds} seconds`}
    style={({ pressed }) => [styles.glassIconButton, timerSeconds > 0 && styles.glassIconButtonActive, pressed && styles.pressed]}
    onPress={cycleTimer}
  >
    <Text style={[styles.timerButtonLabel, timerSeconds > 0 && styles.timerButtonLabelActive]}>
      {timerSeconds === 0 ? '⏱' : `${timerSeconds}s`}
    </Text>
  </Pressable>

  {/* existing flash button unchanged */}
  <Pressable ...>...</Pressable>

  {/* existing camera-flip button unchanged */}
  <Pressable ...>...</Pressable>
</View>
```

### Step 6f — Add countdown overlay inside the viewfinder

Inside the viewfinder `<View style={styles.viewfinder}>`, after the `shutterFlash` overlay from Task 5, add:

```tsx
          {/* Self-Timer Countdown Overlay */}
          {timerCountdown !== null ? (
            <View pointerEvents="none" style={styles.timerCountdownOverlay}>
              <Text style={styles.timerCountdownText}>{timerCountdown}</Text>
            </View>
          ) : null}
```

### Step 6g — Add new styles

In `StyleSheet.create({...})`, add:

```tsx
  timerCountdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 50,
  },
  timerCountdownText: {
    color: '#FFFFFF',
    fontSize: 96,
    fontWeight: '300',
    letterSpacing: -4,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  timerButtonLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    fontWeight: '700',
  },
  timerButtonLabelActive: {
    color: colors.accent,
  },
```

### Verification
- Run `npm run typecheck` — must exit 0.
- `ReturnType<typeof setInterval>` is the correct cross-platform type for a timer ref.

---

## Task 7 — Share Sheet (Share captured photo)

**Status:** ✅ Done  
**Priority:** 🟡 High value  
**Files to change:** `app/preview.tsx` only  
**Install package:** `expo-sharing`

### Step 7a — Install

```bash
npx expo install expo-sharing
```

### Step 7b — Add import to `app/preview.tsx`

After the existing imports, add:

```tsx
import * as Sharing from 'expo-sharing';
```

### Step 7c — Add sharing state and function

In `PreviewScreen()`, after `const [error, setError] = useState<string | null>(null);`, add:

```tsx
const [isSharing, setIsSharing] = useState(false);
```

After the `savePhoto` function (closing `};`), add a new function:

```tsx
const sharePhoto = async () => {
  if (!capturedUri || isSharing) return;
  setIsSharing(true);
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      setError('Sharing is not available on this device.');
      return;
    }
    await Sharing.shareAsync(capturedUri, {
      mimeType: 'image/jpeg',
      dialogTitle: 'Share your photo',
      UTI: 'public.jpeg',
    });
  } catch {
    setError('Could not open the share sheet. Please try again.');
  } finally {
    setIsSharing(false);
  }
};
```

### Step 7d — Add Share button to the bottom dock JSX

Find the `<View style={styles.bottomDock}>` section. It currently has two buttons: Retake and Save. Add a Share button **between** them:

```tsx
<View style={styles.bottomDock}>
  {/* Retake button — unchanged */}
  <Pressable accessibilityLabel="Retake Photo" style={({ pressed }) => [styles.retakeButton, pressed && styles.pressed]} onPress={() => router.back()} disabled={isSaving}>
    <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
    <Text style={styles.retakeButtonText}>Retake</Text>
  </Pressable>

  {/* New Share button */}
  <Pressable
    accessibilityLabel="Share photo"
    style={({ pressed }) => [styles.shareButton, (isSharing) && styles.disabled, pressed && styles.pressed]}
    onPress={sharePhoto}
    disabled={isSharing}
  >
    {isSharing
      ? <ActivityIndicator size="small" color="#FFFFFF" />
      : <Ionicons name="share-outline" size={19} color="#FFFFFF" />}
    <Text style={styles.shareButtonText}>Share</Text>
  </Pressable>

  {/* Save button — unchanged */}
  <Pressable accessibilityLabel="Save to Photos" style={({ pressed }) => [styles.saveButton, (isSaving || saved) && styles.disabled, pressed && styles.pressed]} onPress={savePhoto} disabled={isSaving || saved}>
    {isSaving ? <ActivityIndicator size="small" color="#000000" /> : <Ionicons name={saved ? "checkmark" : "download-outline"} size={19} color="#000000" />}
    <Text style={styles.saveButtonText}>{saved ? 'Saved' : 'Save Photo'}</Text>
  </Pressable>
</View>
```

### Step 7e — Add new styles

In `StyleSheet.create({...})` in `preview.tsx`, add after `retakeButton`:

```tsx
  shareButton: {
    flex: 1,
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  shareButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
```

> **Note:** `colors.blue` is `'#007AFF'` as defined in `constants/theme.ts`. Do not hardcode the hex.

### Step 7f — Update `bottomDock` style to handle 3 buttons

The existing `bottomDock` style is:
```tsx
  bottomDock: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.xs,
  },
```

This already works with 3 flex children. No change needed. The `retakeButton` has `flex: 1`, `shareButton` has `flex: 1`, `saveButton` has `flex: 1.5`. This creates a balanced 3-button layout.

### Verification
- Run `npm run typecheck` — must exit 0.
- `Sharing.isAvailableAsync()` returns `Promise<boolean>`. `Sharing.shareAsync(url, options)` accepts `{ mimeType, dialogTitle, UTI }`.

---

## Task 8 — Side-by-Side Comparison View

**Status:** ❌ Not done  
**Priority:** 🟡 High value  
**Files to change:** `app/preview.tsx` only  
**No new packages needed.**

### What it does
A "Compare" toggle button appears in the preview screen nav bar. When toggled on, the screen splits: top half shows the captured photo, bottom half shows the original reference image (passed as a URL param from the camera screen). A label clearly marks each half.

### Step 8a — Pass `referenceUri` from camera to preview

In `app/camera.tsx`, find the `capturePhoto` function (or `fireCaptureNow` after Task 6). Find this line:

```tsx
router.push({ pathname: '/preview', params: { capturedUri: result.uri } });
```

Replace with:

```tsx
router.push({
  pathname: '/preview',
  params: {
    capturedUri: result.uri,
    referenceUri: referenceUri ?? '',
  },
});
```

### Step 8b — Read `referenceUri` in `app/preview.tsx`

Find the existing params destructuring at the top of `PreviewScreen`:

```tsx
const { capturedUri } = useLocalSearchParams<{ capturedUri?: string }>();
```

Replace with:

```tsx
const { capturedUri, referenceUri } = useLocalSearchParams<{ capturedUri?: string; referenceUri?: string }>();
```

### Step 8c — Add comparison state

In `PreviewScreen()`, after `const [isSharing, setIsSharing] = useState(false);`, add:

```tsx
const [compareMode, setCompareMode] = useState(false);
```

### Step 8d — Add Compare button to the nav bar

Find the existing nav bar section in the JSX:

```tsx
        <View style={styles.iosNavBar}>
          <Pressable accessibilityLabel="Discard and return" ...>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </Pressable>
          <View style={styles.navTitleCenter}>
            <Text style={styles.navTitle}>Photo Preview</Text>
            <Text style={styles.navSubtitle}>ORIGINAL CAPTURE</Text>
          </View>
          <View style={styles.navPlaceholder} />
        </View>
```

Replace `<View style={styles.navPlaceholder} />` with a Compare toggle button (only visible when `referenceUri` exists):

```tsx
          {referenceUri ? (
            <Pressable
              accessibilityLabel={compareMode ? 'Exit comparison mode' : 'Compare with reference'}
              style={({ pressed }) => [styles.compareToggleButton, compareMode && styles.compareToggleButtonActive, pressed && styles.pressed]}
              onPress={() => setCompareMode((c) => !c)}
            >
              <Ionicons name="git-compare-outline" size={18} color={compareMode ? colors.accent : '#FFFFFF'} />
            </Pressable>
          ) : (
            <View style={styles.navPlaceholder} />
          )}
```

### Step 8e — Replace the photo viewport JSX with comparison-aware rendering

Find:

```tsx
        {/* Photo Viewport */}
        <View style={styles.photoViewport}>
          <Image source={{ uri: capturedUri }} style={styles.image} resizeMode="contain" />
        </View>
```

Replace with:

```tsx
        {/* Photo Viewport — normal or compare mode */}
        {compareMode && referenceUri ? (
          <View style={styles.compareContainer}>
            <View style={styles.compareHalf}>
              <Image source={{ uri: capturedUri }} style={styles.image} resizeMode="cover" />
              <View style={styles.compareLabel}>
                <Text style={styles.compareLabelText}>CAPTURED</Text>
              </View>
            </View>
            <View style={styles.compareDivider} />
            <View style={styles.compareHalf}>
              <Image source={{ uri: referenceUri }} style={styles.image} resizeMode="cover" />
              <View style={styles.compareLabel}>
                <Text style={styles.compareLabelText}>REFERENCE</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.photoViewport}>
            <Image source={{ uri: capturedUri }} style={styles.image} resizeMode="contain" />
          </View>
        )}
```

### Step 8f — Add new styles

In `StyleSheet.create({...})` in `preview.tsx`, add:

```tsx
  compareToggleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(44, 44, 46, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareToggleButtonActive: {
    backgroundColor: 'rgba(255, 214, 10, 0.2)',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  compareContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    marginVertical: spacing.sm,
  },
  compareHalf: {
    flex: 1,
    position: 'relative',
  },
  compareDivider: {
    height: 2,
    backgroundColor: colors.accent,
  },
  compareLabel: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  compareLabelText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
```

### Verification
- Run `npm run typecheck` — must exit 0.
- `useLocalSearchParams` already imported from `'expo-router'`. No additional import needed.

---

## Task 9 — Onboarding / First-Launch Tips

**Status:** ❌ Not done  
**Priority:** 🟡 Medium  
**Files to change:** `app/index.tsx` only  
**No new packages needed** — uses `AsyncStorage` already imported.

### What it does
On the very first time the user opens the app (and only then), a bottom sheet-style overlay appears over the home screen explaining the 3-step workflow. It has a "Got it" button that dismisses it and sets an AsyncStorage flag so it never appears again.

### Step 9a — Add onboarding state

In `HomeScreen()` in `app/index.tsx`, after `const [recentReferences, setRecentReferences] = useState<string[]>([]);`, add:

```tsx
const [showOnboarding, setShowOnboarding] = useState(false);
```

### Step 9b — Check first launch in the existing `useEffect`

The current `useEffect` in `index.tsx` loads the reference history. Extend it to also check for the onboarding flag:

```tsx
useEffect(() => {
  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      if (!stored) return;
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed)) setRecentReferences(parsed.filter((item): item is string => typeof item === 'string').slice(0, MAX_HISTORY_SIZE));
    } catch {
      // Storage is optional; the current-session picker remains available.
    }
  };

  const checkOnboarding = async () => {
    try {
      const seen = await AsyncStorage.getItem('@posemate/onboarding-seen');
      if (!seen) setShowOnboarding(true);
    } catch {
      // If storage fails, do not block the user.
    }
  };

  void loadHistory();
  void checkOnboarding();
}, []);
```

### Step 9c — Add dismiss function

After `const persistHistory = async (...)` function, add:

```tsx
const dismissOnboarding = async () => {
  setShowOnboarding(false);
  try {
    await AsyncStorage.setItem('@posemate/onboarding-seen', '1');
  } catch {
    // Non-critical.
  }
};
```

### Step 9d — Add onboarding overlay JSX

At the **very end** of the `return (...)` block, before the final closing `</SafeAreaView>`, add:

```tsx
        {/* First-Launch Onboarding Overlay */}
        {showOnboarding ? (
          <View style={styles.onboardingOverlay}>
            <View style={styles.onboardingSheet}>
              <View style={styles.onboardingHandle} />
              <Text style={styles.onboardingTitle}>How PoseMate works</Text>

              <View style={styles.onboardingStep}>
                <View style={styles.onboardingStepNumber}><Text style={styles.onboardingStepNumText}>1</Text></View>
                <View style={styles.onboardingStepBody}>
                  <Text style={styles.onboardingStepTitle}>Choose a Reference Photo</Text>
                  <Text style={styles.onboardingStepDesc}>Pick any image from your photo library — a pose, a composition, or a scene you want to recreate.</Text>
                </View>
              </View>

              <View style={styles.onboardingStep}>
                <View style={styles.onboardingStepNumber}><Text style={styles.onboardingStepNumText}>2</Text></View>
                <View style={styles.onboardingStepBody}>
                  <Text style={styles.onboardingStepTitle}>Align with Your Camera</Text>
                  <Text style={styles.onboardingStepDesc}>The reference image floats over your live camera. Drag, pinch, and rotate it to match your subject to the reference.</Text>
                </View>
              </View>

              <View style={styles.onboardingStep}>
                <View style={styles.onboardingStepNumber}><Text style={styles.onboardingStepNumText}>3</Text></View>
                <View style={styles.onboardingStepBody}>
                  <Text style={styles.onboardingStepTitle}>Capture and Save</Text>
                  <Text style={styles.onboardingStepDesc}>Tap the shutter. Your photo is saved cleanly — no overlay, just the perfect shot.</Text>
                </View>
              </View>

              <Pressable
                accessibilityLabel="Got it, dismiss tips"
                style={({ pressed }) => [styles.onboardingButton, pressed && styles.pressed]}
                onPress={dismissOnboarding}
              >
                <Text style={styles.onboardingButtonText}>Got it</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
```

### Step 9e — Add new styles

In `StyleSheet.create({...})` in `index.tsx`, add:

```tsx
  onboardingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  onboardingSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  onboardingHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderLight,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  onboardingTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.lg,
    letterSpacing: -0.4,
  },
  onboardingStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  onboardingStepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  onboardingStepNumText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
  onboardingStepBody: { flex: 1 },
  onboardingStepTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  onboardingStepDesc: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  onboardingButton: {
    marginTop: spacing.lg,
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardingButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
```

> **Important:** `StyleSheet.absoluteFillObject` (not `StyleSheet.absoluteFill`) must be spread with `...` when used inside a style object, not assigned as a style directly.

### Verification
- Run `npm run typecheck` — must exit 0.
- `AsyncStorage` and `StyleSheet` are already imported in `index.tsx`.

---

## Task 10 — EAS Build Configuration Completion

**Status:** ❌ Not done  
**Priority:** 🔴 BLOCKER (required before submitting to App Store)  
**Files to change:** `eas.json` only

### What to do

Replace the entire contents of `eas.json` with:

```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "buildConfiguration": "Release"
      }
    },
    "production": {
      "ios": {
        "buildConfiguration": "Release",
        "credentialsSource": "remote"
      },
      "android": {
        "buildType": "app-bundle",
        "credentialsSource": "remote"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "FILL_IN_YOUR_APPLE_ID_EMAIL",
        "ascAppId": "FILL_IN_APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "FILL_IN_YOUR_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./play-store-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

**What to fill in:**
- `appleId`: your Apple ID email used to log into App Store Connect
- `ascAppId`: the numeric App ID shown in App Store Connect → App Information
- `appleTeamId`: your 10-character Apple Developer Team ID (found at developer.apple.com → Account → Membership)

> **Note:** `play-store-service-account.json` is the service account JSON downloaded from Google Play Console. This file should **not** be committed to git. Add it to `.gitignore`.

---

## Task 11 — Android `package` Identifier in `app.json`

**Status:** ❌ Not done  
**Priority:** 🟡 Required for Android builds  
**Files to change:** `app.json` only

### What to do

In `app.json`, find the `"android"` object:

```json
"android": {
  "permissions": [
    "CAMERA",
    "READ_MEDIA_IMAGES",
    "WRITE_EXTERNAL_STORAGE"
  ]
},
```

Replace with:

```json
"android": {
  "package": "com.posemate.app",
  "versionCode": 1,
  "permissions": [
    "CAMERA",
    "READ_MEDIA_IMAGES",
    "WRITE_EXTERNAL_STORAGE"
  ]
},
```

---

## Task 12 — Add `expo-haptics` to `app.json` plugin list

**Status:** ❌ Not done (required after Task 4)  
**Priority:** 🟡 Required for haptics to work in standalone builds  
**Files to change:** `app.json`

### What to do

After installing `expo-haptics` (Task 4), it needs to be added as an Expo plugin. In `app.json`, find the `"plugins"` array:

```json
"plugins": [
  "expo-router",
  [
    "expo-media-library",
    {
      "photosPermission": "PoseMate uses your photo library to select reference poses.",
      "savePhotosPermission": "PoseMate saves your finished photographs to your photo library."
    }
  ]
],
```

Replace with:

```json
"plugins": [
  "expo-router",
  [
    "expo-media-library",
    {
      "photosPermission": "PoseMate uses your photo library to select reference poses.",
      "savePhotosPermission": "PoseMate saves your finished photographs to your photo library."
    }
  ],
  "expo-haptics"
],
```

> **Note:** `expo-haptics` does not require extra config parameters. It just needs to be listed.

---

## Task 13 — `maxFontSizeMultiplier` on Critical Text

**Status:** ❌ Not done  
**Priority:** 🟢 Accessibility  
**Files to change:** `app/camera.tsx`

### What it does
Prevents camera control labels from overflowing when the user has the iOS "Larger Accessibility Text" setting turned on. Only camera screen controls need this — text in that screen is in constrained-width containers and cannot reflow.

### What to do

In `app/camera.tsx`, add `maxFontSizeMultiplier={1.1}` to these specific `<Text>` elements:

1. `<Text style={styles.topStatusText}>ALIGNMENT</Text>`  
   → `<Text style={styles.topStatusText} maxFontSizeMultiplier={1.1}>ALIGNMENT</Text>`

2. `<Text style={styles.overlayStatusLabel}>POSE OVERLAY</Text>`  
   → `<Text style={styles.overlayStatusLabel} maxFontSizeMultiplier={1.1}>POSE OVERLAY</Text>`

3. `<Text style={styles.overlayValueLabel}>{Math.round(overlayOpacity * 100)}%</Text>`  
   → `<Text style={styles.overlayValueLabel} maxFontSizeMultiplier={1.1}>{Math.round(overlayOpacity * 100)}%</Text>`

4. Each zoom step text in the floating zoom dock:  
   `<Text style={[styles.zoomStepText, ...]}>1×</Text>`  
   → `<Text style={[styles.zoomStepText, ...]} maxFontSizeMultiplier={1.0}>1×</Text>` (same for `2×`, `3×`)

### Verification
- Run `npm run typecheck` — must exit 0.
- `maxFontSizeMultiplier` is a valid prop on React Native `Text` from `'react-native'`.

---

## Task 14 — `.gitignore` and Git Hygiene

**Status:** ❌ Not done  
**Priority:** 🟡 Required before any public repo  
**Files to change:** `.gitignore` (create if missing)

### What to do

Ensure the project root has a `.gitignore` with these entries. If the file doesn't exist, create it. If it does, add any missing lines:

```gitignore
# Dependencies
node_modules/

# Expo
.expo/
dist/
web-build/

# EAS / Credentials — NEVER commit these
play-store-service-account.json
*.p8
*.p12
*.mobileprovision
google-services.json
GoogleService-Info.plist

# OS
.DS_Store
Thumbs.db

# TypeScript
*.js.map

# Build artifacts
ios/
android/
```

> **Why this matters:** The `play-store-service-account.json` file (Task 10) contains private keys. Committing it to a public GitHub repository would expose your Google Play account.

---

## Implementation Order

Do these tasks in this exact sequence to avoid breaking anything:

```
1  → App Icon                    (blocker — do first)
2  → Splash Screen               (blocker — do second)
3  → Privacy Policy Page         (non-code — do any time)
4  → Haptic Feedback             (install expo-haptics first)
12 → Add expo-haptics to app.json (do immediately after Task 4)
5  → Shutter Flash Animation     (depends on Task 4 for the haptic call)
6  → Self-Timer                  (depends on Task 5 for fireCaptureNow)
7  → Share Sheet                 (install expo-sharing, independent)
8  → Side-by-Side Comparison     (depends on Task 7 — preview screen already updated)
9  → Onboarding Tips             (independent, do any time after Tasks 1-2)
10 → EAS Configuration           (fill in real Apple credentials)
11 → Android package in app.json (independent)
13 → maxFontSizeMultiplier       (independent, do last)
14 → .gitignore                  (do before any git push)
```

---

## After All Tasks — Final Checklist

```
[ ] npm run typecheck          — exits 0 with no errors
[ ] assets/icon.png            — exists, 1024×1024, no alpha
[ ] assets/splash-icon.png     — exists
[ ] Privacy policy URL         — publicly accessible
[ ] eas.json                   — Apple credentials filled in (not committed)
[ ] .gitignore                 — play-store-service-account.json excluded
[ ] eas build --platform ios --profile development
[ ] Install dev build on physical iPhone
[ ] Run ALL Phase 14 test matrix items from todo.md
[ ] eas build --platform ios --profile production
[ ] eas submit --platform ios
```

---

*Last updated: November 2026 · Expo SDK 58 · React Native 0.88.1 · bundle ID: com.posemate.app*
