# Project Brief: PoseMate – Your Personal Photography Pose Assistant

## 1. Project Overview

Build a mobile application that helps people recreate their favourite photography poses using a real-time camera overlay.

Many people struggle with posing when taking photographs at scenic locations, tourist destinations, cafes, beaches, and other places. They often have a reference photograph saved on their phone but don't know how to recreate the same body position, hand placement, posture, or camera composition.

Even photographers sometimes struggle to communicate exactly how a person should pose.

The application solves this problem by allowing users to select an existing reference photograph from their phone gallery and display it as a semi-transparent overlay on top of the live camera preview.

The user or photographer can then visually align the person's actual body position with the reference photograph before capturing the final picture.

**Core concept: Select a pose → Overlay it on the live camera → Adjust transparency → Recreate the pose → Capture the photograph.**

The application should be simple, elegant, modern, and extremely easy to use.

## 2. Primary Objective

Create an application that acts as a real-time visual photography pose guide.

The main purpose is NOT to generate photographs or automatically create poses using AI.

Instead, users bring their own inspiration photographs, and the application helps them recreate those poses accurately.

## 3. Core User Workflow

### Step 1: Select a Reference Photograph
- Allow users to access their iPhone Photos/Gallery.
- Let users select any photograph they want to recreate.
- Display the selected photograph in the camera interface.
- Allow users to change or remove the reference photograph.

### Step 2: Open the Camera
- Open the device's live camera preview.
- Display the selected reference photograph over the camera preview.
- The reference photograph must appear as a floating transparent layer.
- The live camera should remain visible underneath the reference photograph.

### Step 3: Adjust the Reference Overlay

Provide the following controls:

1. **Opacity Slider:** Adjust transparency from 0% to 100%.
2. **Resize:** Increase or decrease the reference image size.
3. **Position:** Move the reference image anywhere on the screen.
4. **Rotation:** Rotate the reference image if necessary.
5. **Flip:** Horizontally mirror the reference image.
6. **Lock Overlay:** Prevent accidental movement after positioning.
7. **Reset:** Restore the original overlay settings.

The overlay should be adjustable without interrupting the live camera preview.

### Step 4: Recreate the Pose

The person being photographed should position themselves according to the reference image.

The photographer should be able to see both:
- The live camera view.
- The reference pose overlay.

This makes it easier to guide the subject regarding their posture, body positioning, hand placement, head angle, and overall composition.

### Step 5: Capture the Photograph

- Provide a large, accessible capture button.
- Capture the actual camera image.
- The reference overlay MUST NOT appear in the final captured photograph.
- Save the captured photograph directly to the device's Photos/Gallery.
- Allow users to retake the photograph.

## 4. Main Application Features

### A. Home Screen
Create a beautiful, minimal home screen containing:

- Application logo and name.
- A prominent "Start Shooting" button.
- A "Choose Reference Photo" option.
- Recently used reference photographs.
- Favourite poses (future feature).
- Settings.

The home screen should feel premium and photography-oriented.

### B. Reference Image Selection
- Integrate the native device photo picker.
- Support common image formats.
- Display the selected reference image.
- Allow users to replace the selected image easily.

### C. Camera Screen (Most Important Feature)

This is the core of the entire application.

The screen should contain:

- Full-screen live camera preview.
- Transparent reference image overlay.
- Opacity adjustment slider.
- Image resizing controls.
- Image positioning controls.
- Rotation and flip controls.
- Lock/unlock overlay.
- Front/rear camera switching.
- Flash control where supported.
- Capture button.
- Close/back button.

The camera interface should be clean and uncluttered. Controls should be intuitive and should not unnecessarily obstruct the camera preview.

### D. Photo Preview
After capturing an image:

- Show the final captured photograph.
- Provide Save, Retake and Cancel options.
- Ensure the reference overlay is not included.
- Save the actual photograph in its original camera quality as far as the platform permits.

## 5. UI/UX Design Direction

The application should have a premium, modern photography application aesthetic.

Design preferences:

- Minimal and clean interface.
- Dark theme, especially for the camera screen.
- Smooth animations and transitions.
- Rounded controls and subtle borders.
- Modern typography.
- Well-spaced layouts.
- Intuitive icons.
- No unnecessary buttons or complicated navigation.

The camera screen should prioritize the actual photograph over the controls.

The opacity slider should be easily accessible, preferably near the bottom of the screen.

The application should look like a professionally designed iOS application rather than a generic website wrapped inside a mobile application.

## 6. Recommended Technology Stack

Use the following technologies:

| Component | Technology |
|---|---|
| Mobile framework | React Native |
| Framework/tooling | Expo |
| Language | TypeScript |
| Camera integration | Expo Camera |
| Image picker | Expo Image Picker |
| Image manipulation | Expo Image Manipulator, where needed |
| Local storage | AsyncStorage |
| Navigation | Expo Router |
| Styling | React Native StyleSheet |
| Build and testing | Expo EAS |

Prefer native mobile components and APIs wherever possible.

Important: Verify that the selected camera implementation supports the required live preview and overlay behavior on a physical iPhone. The overlay must be a separate UI layer above the camera preview, not permanently merged with the captured image.

## 7. Important Technical Requirements

1. The camera preview must run smoothly while the overlay is displayed.
2. Changing opacity must update the overlay in real time.
3. Moving, resizing and rotating the overlay must not interrupt the camera.
4. The overlay must never be included in the final captured photograph.
5. The final photograph should retain the camera's actual captured resolution and quality.
6. Request camera and photo library permissions appropriately.
7. Handle denied permissions gracefully.
8. Support different iPhone screen sizes and aspect ratios.
9. Ensure controls work properly on actual iOS devices.
10. Keep the app functional without requiring an internet connection for its core features.

## 8. Future Features (Do Not Prioritize in Initial MVP)

These features can be introduced after the core application is working.

### AI Pose Analysis
- Detect the user's body position.
- Compare it against the reference photograph.
- Identify differences in posture and body alignment.
- Suggest adjustments such as moving an arm, changing head angle, or adjusting body orientation.

### Pose Library
- Built-in collections of photography poses.
- Categories such as:
  - Beach poses.
  - Sunset poses.
  - Cafe poses.
  - Street photography.
  - Travel photography.
  - Sitting poses.
  - Standing poses.
  - Couple photography.

### Additional Features
- Save favourite reference photographs.
- Maintain pose collections.
- Compare reference and captured photographs.
- Share captured photographs.
- Provide different camera grid options.
- Add a timer for solo photography.

These features are optional future improvements. The first version must focus entirely on making the reference-image camera overlay work perfectly.

## 9. Development Strategy

Develop the application in the following order:

**Phase 1: Project Setup**
- Initialize Expo and React Native.
- Configure TypeScript.
- Set up navigation.
- Establish the application's design system.

**Phase 2: Reference Image Selection**
- Integrate the native photo picker.
- Display the selected reference image.
- Handle image permissions.

**Phase 3: Camera Integration**
- Implement the live camera preview.
- Add front/rear camera switching.
- Handle camera permissions.

**Phase 4: Overlay Implementation**
- Display the reference photograph above the camera.
- Implement opacity adjustment.
- Implement dragging, resizing, rotation and flipping.
- Implement overlay locking and resetting.

**Phase 5: Photography**
- Capture the actual camera frame without the overlay.
- Implement image preview.
- Save photographs to the device gallery.
- Implement retake functionality.

**Phase 6: UI Polish and Testing**
- Refine the camera interface.
- Add smooth animations.
- Test different screen sizes.
- Test camera permissions and edge cases.
- Test on an actual iPhone.

## 10. Expected Final Deliverable

The final deliverable should be a fully functional iOS application that can be installed on an iPhone.

It should allow a user to:

1. Open the application.
2. Select a reference photograph from their gallery.
3. Open the live camera.
4. See their selected photograph as a transparent overlay.
5. Adjust its opacity, size, position and rotation.
6. Align their pose with the reference.
7. Capture the photograph.
8. Save the final photograph to their iPhone without the overlay.

The application should work locally without requiring an account, backend server, subscription, API key, or internet connection for its core functionality.

## 11. Instructions to the AI Developer

Before writing code:

- Understand the entire project requirement.
- Propose a clean and scalable folder structure.
- Identify the correct Expo libraries and their compatibility with the current Expo SDK.
- Pay special attention to the camera preview and overlay architecture.
- Explain any technical limitations before implementing workarounds.

Do not build a web application. This must be a genuine React Native mobile application.

Do not implement unnecessary AI features or backend infrastructure in the MVP.

Build the application incrementally, test each major feature, and prioritize a reliable camera-overlay experience over decorative UI.

**The most important requirement: The user must be able to see their selected reference photograph over the live camera preview, adjust its transparency, recreate the pose, and capture a clean photograph without the reference overlay.**
