# PoseMate Implementation Todo

This document breaks PoseMate into small, verifiable milestones. Each step should be implemented and tested before moving to the next step.

## How to Use This Checklist

- Complete phases in order.
- Mark a checkbox only after the feature works on the intended device or simulator.
- Keep the app runnable after every step.
- Do not start future features until the MVP camera-overlay workflow is reliable.
- Test important camera behavior on a physical iPhone, not only in a simulator.
- Completed implementation items are marked immediately; device-verified items remain unchecked until tested.

---

## Phase 0 — Confirm Scope and Development Environment

### Goals

- Confirm the MVP scope.
- Prepare the local development environment.
- Establish the project baseline.

### Tasks

- [ ] Confirm that the MVP includes only reference photo selection, camera preview, overlay controls, capture, preview, save, and retake.
- [ ] Confirm that AI pose analysis, accounts, backend services, subscriptions, social features, and built-in pose libraries are out of scope for the MVP.
- [x] Check the installed Node.js version.
- [x] Check the installed npm or package manager version.
- [x] Check Expo CLI and Expo SDK compatibility.
- [ ] Confirm access to an iPhone for physical testing.
- [ ] Confirm that the iPhone can run an Expo development build or Expo Go where supported.
- [ ] Confirm that camera and photo-library permissions can be tested on the device.
- [ ] Record the selected Expo SDK and package versions in the project documentation.

### Verification checklist

- [x] The project can be started locally.
- [ ] The initial app opens without errors.
- [x] The selected SDK and dependency versions are documented.
- [ ] A physical-device testing plan is available.

### Milestone

The development environment is ready and the MVP scope is agreed.

---

## Phase 1 — Project Foundation

### Goals

- Create a clean React Native application structure.
- Configure TypeScript, navigation, and shared styling.

### Tasks

- [x] Initialize or verify the Expo React Native project.
- [x] Configure TypeScript with strict, practical settings.
- [x] Configure Expo Router navigation.
- [x] Create the initial route structure.
- [x] Create a shared constants folder.
- [x] Create a shared theme file for colors, spacing, typography, radii, and shadows.
- [x] Create reusable button, text, card, icon-button, and screen-container components where useful.
- [x] Add safe-area handling.
- [x] Add a basic error boundary or app-level error fallback.
- [x] Configure the app name and bundle identifiers when appropriate.
- [x] Add a README section describing how to run the app.

### Suggested structure

```text
app/
  _layout.tsx
  index.tsx
  home.tsx
  camera.tsx
  preview.tsx
components/
constants/
hooks/
services/
storage/
types/
utils/
assets/
```

### Verification checklist

- [ ] App launches successfully.
- [ ] Navigation between placeholder screens works.
- [x] TypeScript checks pass.
- [ ] No avoidable warnings appear during startup.
- [ ] The app has a consistent theme and spacing system.

### Milestone

The project has a stable, scalable foundation.

---

## Phase 2 — Home Screen and Initial User Flow

### Goals

- Build the first user-facing screen.
- Make the intended workflow clear before camera functionality is added.

### Tasks

- [ ] Design the PoseMate home screen.
- [ ] Add the app logo or temporary branded mark.
- [ ] Add the PoseMate name and short supporting text.
- [ ] Add the primary “Start Shooting” button.
- [ ] Add the “Choose Reference Photo” action.
- [ ] Add a recently used references section placeholder.
- [ ] Add a settings entry point placeholder.
- [ ] Add empty-state messaging when no reference photo has been selected.
- [ ] Add navigation from the home screen to the reference picker flow.
- [ ] Ensure buttons have pressed, disabled, and loading states where needed.
- [ ] Make the screen responsive across common iPhone sizes.

### Verification checklist

- [ ] Home screen looks correct on small and large iPhone layouts.
- [ ] Primary actions are easy to find and tap.
- [ ] Empty states are understandable.
- [ ] Navigation does not crash or produce blank screens.

### Milestone

The user can open PoseMate and understand how to begin.

---

## Phase 3 — Permissions and Reference Photo Selection

### Goals

- Let the user select a photo from the device gallery.
- Handle permissions and cancellation safely.

### Tasks

- [x] Install and configure the compatible Expo image-picker package.
- [x] Request photo-library permission only when the user starts photo selection.
- [ ] Explain why photo access is needed when required.
- [ ] Handle permission granted state.
- [x] Handle permission denied state.
- [ ] Handle limited photo-library access where supported.
- [x] Handle user cancellation without showing an error.
- [x] Restrict selection to a single image for the MVP.
- [ ] Support common image formats returned by the native picker.
- [x] Store the selected image URI in app state.
- [x] Display the selected reference image on the home screen.
- [ ] Add a replace-reference action.
- [ ] Add a remove-reference action.
- [ ] Add basic image-loading and image-error states.

### Verification checklist

- [ ] A user can select a photo successfully.
- [ ] A user can replace the selected photo.
- [ ] A user can remove the selected photo.
- [ ] Denied permissions produce a helpful message and recovery action.
- [ ] Canceling the picker leaves the app in a valid state.
- [ ] Very large images do not immediately crash the app.

### Milestone

The user can reliably choose and manage a reference image.

---

## Phase 4 — Camera Permissions and Live Preview

### Goals

- Add a real live camera screen.
- Support the essential camera controls.

### Tasks

- [x] Install and configure the compatible Expo camera package.
- [x] Request camera permission when entering the camera flow.
- [x] Handle camera permission denial.
- [x] Add a camera permission recovery path.
- [x] Render the live camera preview full-screen or within the intended layout.
- [ ] Add a close/back button.
- [x] Add front-camera and rear-camera switching.
- [ ] Preserve the selected reference image while opening the camera.
- [x] Add a camera-loading state.
- [ ] Handle camera initialization failures gracefully.
- [ ] Add flash control only if supported reliably by the selected camera API.
- [ ] Add a large capture button placeholder.

### Verification checklist

- [ ] Camera permission is requested correctly.
- [ ] Live preview appears on a physical iPhone.
- [ ] Back navigation works without leaving the camera active.
- [ ] Front/rear switching works.
- [ ] Permission denial is understandable and recoverable.
- [ ] The camera does not remain active after leaving the screen.

### Milestone

The user can open a stable live camera preview.

---

## Phase 5 — Basic Reference Overlay

### Goals

- Display the selected reference photo above the live camera preview.
- Prove the most important architecture: camera and overlay remain separate layers.

### Tasks

- [ ] Render the camera as the background layer.
- [x] Render the reference image as a separate UI layer above the camera.
- [x] Ensure the overlay does not modify the camera component itself.
- [x] Preserve the reference image aspect ratio.
- [x] Add a default overlay size.
- [x] Add a default centered overlay position.
- [x] Add a default opacity value.
- [x] Add a visible but unobtrusive overlay boundary or handle design if needed.
- [ ] Ensure camera controls remain visible above or below the overlay as intended.
- [ ] Ensure the overlay does not block the capture button.

### Verification checklist

- [ ] Live camera remains visible underneath the image.
- [ ] Reference image appears immediately after camera initialization.
- [ ] Overlay remains smooth while the camera is running.
- [ ] Overlay is not permanently merged into the camera preview.
- [ ] Different reference image aspect ratios display correctly.

### Milestone

The core camera-overlay architecture works.

---

## Phase 6 — Overlay Opacity and Basic Controls

### Goals

- Make the overlay useful for aligning a subject.
- Add the simplest high-value adjustment first.

### Tasks

- [ ] Add an opacity slider.
- [ ] Set a sensible default opacity.
- [ ] Update overlay opacity in real time while dragging.
- [ ] Display the current opacity value if it improves usability.
- [ ] Add an overlay lock/unlock control.
- [ ] Prevent movement and transformation while locked.
- [ ] Add a reset-overlay action.
- [ ] Reset opacity, position, scale, rotation, and flip state together.
- [ ] Ensure controls remain usable over dark and bright camera scenes.

### Verification checklist

- [ ] Opacity changes smoothly from nearly invisible to fully visible.
- [ ] The camera preview is unaffected by opacity changes.
- [ ] Locked overlays cannot be accidentally moved.
- [ ] Reset restores the expected default state.
- [ ] Controls are usable with one hand where practical.

### Milestone

The user can see through and control the reference image.

---

## Phase 7 — Gesture-Based Overlay Manipulation

### Goals

- Allow precise visual alignment of the reference image.
- Support natural touch gestures.

### Tasks

- [ ] Select a compatible gesture-handler and reanimated approach.
- [ ] Add single-finger dragging.
- [ ] Add pinch-to-resize.
- [ ] Add two-finger rotation.
- [ ] Add sensible minimum and maximum scale limits.
- [ ] Add sensible rotation behavior.
- [ ] Prevent gestures from moving the overlay while locked.
- [ ] Avoid gesture conflicts with camera controls and sliders.
- [ ] Add optional on-screen transformation controls if gestures are insufficient.
- [ ] Add horizontal flip control.
- [ ] Keep transformations smooth on a physical iPhone.
- [ ] Preserve transformation state during temporary control interactions.

### Verification checklist

- [ ] User can drag the image accurately.
- [ ] User can resize the image without unintended jumps.
- [ ] User can rotate the image predictably.
- [ ] User can flip the image horizontally.
- [ ] Lock prevents all transformations.
- [ ] Reset correctly clears every transformation.
- [ ] Gestures do not cause visible camera stutter.

### Milestone

The reference image can be positioned and transformed for real-world posing.

---

## Phase 8 — Camera Controls and Camera Screen Polish

### Goals

- Make the camera screen practical and uncluttered.
- Ensure the camera is the visual priority.

### Tasks

- [ ] Finalize the camera-screen layout.
- [ ] Add the capture button in an ergonomic position.
- [ ] Add front/rear camera control styling.
- [ ] Add flash control styling where supported.
- [ ] Add overlay controls in a collapsible or compact control area if needed.
- [ ] Place the opacity slider where it does not obstruct the subject.
- [ ] Add clear lock and reset icons with accessibility labels.
- [ ] Add safe-area padding for notches and home indicators.
- [ ] Add light and dark visual states that remain readable over the preview.
- [ ] Add subtle transitions for opening and closing controls.
- [ ] Avoid unnecessary animation during camera capture.
- [ ] Add haptic feedback only where it improves clarity and is supported.

### Verification checklist

- [ ] Camera preview remains the dominant element.
- [ ] Capture button is easy to reach.
- [ ] Controls do not cover important parts of the reference or subject unnecessarily.
- [ ] All icons have accessible labels.
- [ ] The layout works in portrait orientation on supported devices.

### Milestone

The camera screen is usable as a real photography tool.

---

## Phase 9 — Capture Without the Overlay

### Goals

- Capture the actual camera frame.
- Guarantee that the visual reference overlay is excluded.

### Tasks

- [ ] Connect the capture button to the camera capture API.
- [ ] Confirm capture uses the actual camera component.
- [ ] Keep the overlay as a UI-only layer during capture.
- [ ] Temporarily disable duplicate capture taps while a photo is being captured.
- [ ] Show a capture-in-progress state if necessary.
- [ ] Store the captured image URI.
- [ ] Handle capture errors.
- [ ] Confirm the reference overlay is absent from the captured file.
- [ ] Preserve the best available camera resolution and quality.
- [ ] Account for front-camera mirroring behavior where applicable.

### Verification checklist

- [ ] Capture produces a valid image.
- [ ] Captured image contains the real camera scene.
- [ ] Captured image never contains the reference overlay.
- [ ] Repeated captures do not freeze or crash the camera.
- [ ] Capture errors provide a recovery path.

### Milestone

PoseMate can create a clean photograph while the overlay remains visible only on screen.

---

## Phase 10 — Photo Preview, Save, Retake, and Cancel

### Goals

- Give the user control after taking a photo.
- Save successful captures to the device gallery.

### Tasks

- [ ] Create a photo-preview screen.
- [ ] Display the captured image at an appropriate aspect ratio.
- [ ] Add Save action.
- [ ] Add Retake action.
- [ ] Add Cancel or discard action.
- [ ] Request media-library permission only when saving if required.
- [ ] Save the captured image to the device Photos/Gallery.
- [ ] Handle save permission denial.
- [ ] Handle save failures.
- [ ] Prevent accidental duplicate saves where practical.
- [ ] Confirm the user receives clear success feedback.
- [ ] Return to the correct screen after save or retake.

### Verification checklist

- [ ] Captured photo displays correctly.
- [ ] Save places the image in the device gallery.
- [ ] Saved image has no overlay.
- [ ] Retake returns to the camera with the reference image available.
- [ ] Cancel returns safely without corrupting app state.
- [ ] Permission and storage errors are understandable.

### Milestone

The complete capture-to-save workflow works.

---

## Phase 11 — Reference History and Local Persistence

### Goals

- Improve repeat usage without adding a backend.
- Persist only useful local data.

### Tasks

- [ ] Select the appropriate AsyncStorage-compatible persistence approach.
- [ ] Store recently used reference image URIs or local copies as appropriate.
- [ ] Define a maximum history size.
- [ ] Add recently used references to the home screen.
- [ ] Allow a recent reference to be selected again.
- [ ] Remove invalid or unavailable history entries safely.
- [ ] Avoid storing unnecessary sensitive data.
- [ ] Add a clear-history action if history is user-visible.
- [ ] Confirm the app remains useful when storage is unavailable.

### Verification checklist

- [ ] Recent references persist after restarting the app where supported.
- [ ] Invalid references do not crash the home screen.
- [ ] History stays within the defined limit.
- [ ] The user can remove stored references.

### Milestone

Repeat sessions are faster while remaining local and private.

---

## Phase 12 — Accessibility, Error Handling, and Edge Cases

### Goals

- Make the MVP dependable for real users.
- Handle non-ideal conditions gracefully.

### Tasks

- [ ] Add accessibility labels to all interactive controls.
- [ ] Ensure controls have adequate touch targets.
- [ ] Check text contrast over all backgrounds.
- [ ] Handle missing camera hardware or unavailable camera states.
- [ ] Handle photo-library permission denial.
- [ ] Handle camera permission denial.
- [ ] Handle interrupted camera sessions.
- [ ] Handle app backgrounding and returning to the camera.
- [ ] Handle phone calls or other camera interruptions where possible.
- [ ] Handle very large reference images.
- [ ] Handle unsupported or corrupted image URIs.
- [ ] Handle low-storage save failures.
- [ ] Handle rapid repeated taps.
- [ ] Handle rotation or unsupported orientation behavior explicitly.
- [ ] Add user-friendly error messages and recovery actions.

### Verification checklist

- [ ] No common permission path leaves the user stuck.
- [ ] Camera errors can be recovered from.
- [ ] Invalid images do not crash the app.
- [ ] Controls are accessible and readable.
- [ ] App backgrounding does not leave the camera unexpectedly active.

### Milestone

The MVP behaves safely when conditions are not perfect.

---

## Phase 13 — Visual Polish and Product Quality

### Goals

- Make PoseMate feel intentional, premium, and photography-focused.

### Tasks

- [ ] Finalize colors, typography, spacing, and iconography.
- [ ] Add a consistent dark camera theme.
- [ ] Refine home-screen empty and populated states.
- [ ] Refine loading, success, and error states.
- [ ] Add appropriate transitions between home, camera, and preview.
- [ ] Remove placeholder text and temporary assets.
- [ ] Check alignment and spacing on multiple iPhone sizes.
- [ ] Check controls against bright, dark, and high-contrast camera scenes.
- [ ] Reduce visual clutter on the camera screen.
- [ ] Confirm app branding is consistent.

### Verification checklist

- [ ] Screens look consistent with one another.
- [ ] No unfinished placeholder UI remains.
- [ ] Camera controls remain practical after visual polish.
- [ ] Animations do not reduce camera performance.

### Milestone

The MVP looks and feels like a focused photography application.

---

## Phase 14 — Testing and Quality Assurance

### Goals

- Validate every critical workflow before release.

### Functional test matrix

- [ ] Fresh install with camera permission granted.
- [ ] Fresh install with camera permission denied.
- [ ] Fresh install with photo permission granted.
- [ ] Fresh install with photo permission denied.
- [ ] Select a reference photo.
- [ ] Replace a reference photo.
- [ ] Remove a reference photo.
- [ ] Open camera with no reference photo.
- [ ] Open camera with a reference photo.
- [ ] Adjust opacity from minimum to maximum.
- [ ] Drag overlay.
- [ ] Resize overlay.
- [ ] Rotate overlay.
- [ ] Flip overlay.
- [ ] Lock and unlock overlay.
- [ ] Reset overlay.
- [ ] Switch front and rear cameras.
- [ ] Use flash where supported.
- [ ] Capture a photo.
- [ ] Confirm captured photo excludes overlay.
- [ ] Preview captured photo.
- [ ] Save captured photo.
- [ ] Retake a photo.
- [ ] Cancel a captured photo.
- [ ] Restart the app after selecting a reference.
- [ ] Return from background while camera is open.
- [ ] Test with large and small reference images.

### Device and layout tests

- [ ] Test on at least one small iPhone screen.
- [ ] Test on at least one large iPhone screen.
- [ ] Test on a physical iPhone with a front camera.
- [ ] Test on a physical iPhone with a rear camera.
- [ ] Test on varying lighting conditions.
- [ ] Test with bright and dark reference images.
- [ ] Test with portrait-oriented references.
- [ ] Test with landscape-oriented references.
- [ ] Test with square references.

### Performance tests

- [ ] Check camera preview smoothness with the overlay visible.
- [ ] Check opacity-slider responsiveness.
- [ ] Check gesture responsiveness.
- [ ] Check memory behavior after repeated image selection.
- [ ] Check repeated capture and retake cycles.
- [ ] Check startup time and camera initialization time.
- [ ] Check that camera resources are released when leaving the screen.

### Milestone

All critical MVP workflows pass on the target physical devices.

---

## Phase 15 — Build, Distribution, and Release Preparation

### Goals

- Prepare an installable iOS build.
- Document the release process.

### Tasks

- [ ] Configure iOS app metadata.
- [ ] Configure camera and photo-library usage descriptions.
- [ ] Configure app icon and splash screen.
- [ ] Confirm bundle identifier.
- [ ] Configure an Expo EAS build profile.
- [ ] Create a development build.
- [ ] Install and test the development build on a physical iPhone.
- [ ] Create a preview or internal testing build.
- [ ] Test permissions in the standalone build, not only in development mode.
- [ ] Confirm image saving works in the standalone build.
- [ ] Confirm no development-only behavior is required for the MVP.
- [ ] Document build commands and release steps.
- [ ] Create a short known-limitations list.

### Verification checklist

- [ ] Standalone iOS build installs successfully.
- [ ] Camera works in the standalone build.
- [ ] Gallery selection works in the standalone build.
- [ ] Overlay controls work in the standalone build.
- [ ] Captured images save correctly.
- [ ] App does not require an account, backend, API key, or internet connection for core use.

### Milestone

PoseMate is ready for controlled iPhone testing or initial release.

---

## MVP Completion Definition

The MVP is complete only when a user can perform this entire flow successfully:

1. Open PoseMate.
2. Select a reference photo from the device gallery.
3. Open the live camera.
4. See the selected photo as a transparent overlay above the camera preview.
5. Adjust opacity.
6. Move, resize, rotate, and flip the overlay.
7. Lock or reset the overlay.
8. Align a subject with the reference pose.
9. Capture a photo.
10. View the captured photo without the overlay.
11. Save the clean photo to the device gallery.
12. Retake or cancel when needed.

If any part of this flow is unreliable, the MVP should remain in testing rather than adding future features.

---

## Future Features — After MVP Stability

These items should not be started until the MVP completion definition is satisfied.

- [ ] Favourite reference photos.
- [ ] User-created pose collections.
- [ ] Built-in pose library.
- [ ] Solo-photography timer.
- [ ] Camera grid options.
- [ ] Compare reference and captured images.
- [ ] Share captured photos.
- [ ] AI pose comparison and guidance.
- [ ] Optional cloud backup or account features.

---

## Progress Log

Use this section to record implementation progress, test devices, blockers, and decisions.

### Current phase

- Phase: 1 — Project Foundation
- Last completed step: Foundation, shared components, fallback UI, dependency alignment, and documentation completed
- Next step: Verify the initial app and navigation on a simulator or physical iPhone

### Decisions and technical notes

- The reference image must remain a separate UI layer above the camera preview.
- The camera capture must never include the reference overlay.
- Core MVP functionality must work offline.
- Physical iPhone testing is required for camera behavior.

### Known blockers

- Dependencies are installed; npm reported 23 audit findings from the dependency tree.
- Native image picker integration is implemented and TypeScript validation passes.
- Native camera preview integration is implemented and TypeScript validation passes.
- Reference image is passed into the camera route and rendered as a separate overlay layer.
- Phase 1 implementation is complete; device/UI verification remains pending.
- Expo Metro bundler starts successfully with telemetry disabled in this restricted environment.
- Expo reported compatibility notices for several package patch versions; these should be aligned before device testing.
- Camera and image-picker integrations are intentionally not implemented until the foundation is verified.
