# Phase 3 — Preset Pose Library

> **Goal:** Give users a curated gallery of pose ideas organized by location/category, so they never run out of inspiration. Each category contains 10 hand-picked reference poses the user can instantly load as a ghost overlay.

---

## New Screen: "Pose Ideas" (Explore Tab)

A new full-screen page accessible from the **Home Screen** with a prominent button (e.g., "✨ Explore Poses"). This screen contains:

1. **Category Grid** — A scrollable grid of category cards with a cover thumbnail and title.
2. **Category Detail** — Tapping a category opens a scrollable gallery of 10 pose photos with a "Use as Reference" button on each.
3. **"Use as Reference"** — Tapping it navigates directly to the Camera screen with that image pre-loaded as the ghost overlay.

---

## Categories & Pose Themes (15 Categories × 10 Poses Each = 150 Poses)

| # | Category | Description |
|---|----------|-------------|
| 1 | 🏖️ **Beach & Ocean** | Standing in waves, walking on sand, sunset silhouettes, sitting on rocks, jumping, back-to-camera ocean gaze, splashing water, leaning on palm tree, lying on sand, holding hat in wind |
| 2 | 🏔️ **Mountains & Hiking** | Summit victory pose, sitting on cliff edge, arms wide at overlook, walking trail from behind, leaning on rock, meditative sitting, backpack candid, jumping at peak, pointing to horizon, group summit |
| 3 | 🌆 **City & Urban** | Crossing street, leaning on wall, sitting on stairs, walking with coffee, looking up at buildings, standing in alley, rooftop pose, doorway lean, phone-in-hand candid, neon light portrait |
| 4 | 🌸 **Garden & Flowers** | Smelling flowers, sitting among blooms, holding bouquet, walking through garden path, flower crown, leaning near arch, side profile with petals, laughing candid, bench pose, golden hour garden |
| 5 | ☕ **Café & Restaurant** | Holding coffee cup, sitting at window, reading book/menu, laughing at table, toast/cheers, looking outside, counter lean, dessert flat-lay with hands, outdoor patio, over-shoulder look |
| 6 | 🌅 **Sunset & Golden Hour** | Silhouette full body, back-lit hair glow, side profile, sitting watching sunset, hands up to sky, couple/friend silhouette, long shadow walk, sun in hands trick, flare portrait, golden field |
| 7 | 🏛️ **Monuments & Architecture** | Standing before grand entrance, staircase pose, column lean, perspective trick (holding monument), symmetry center walk, arch framing, looking up at dome, side profile against facade, reflection pool, corridor walk |
| 8 | 🌊 **Pool & Tropical** | Poolside sitting, feet in water, floating relaxed, diving board, tropical drink in hand, cabana lounge, underwater concept, resort walkway, hammock, palm tree lean |
| 9 | 🏞️ **Waterfall & Forest** | Standing before waterfall, touching stream, forest path walk, sitting on log, tree lean, misty forest, fern framing, rock crossing, hands-out rain, canopy look-up |
| 10 | 🎡 **Amusement & Fun** | Ferris wheel background, cotton candy, carousel ride, rollercoaster candid, jumping/laughing, winning prizes, ticket booth, funhouse mirror, bumper cars, sparkler at night |
| 11 | 🧘 **Yoga & Fitness** | Tree pose, warrior II, headstand, meditation lotus, bridge pose, dancer pose, plank/push-up, stretching on mat, running stride, handstand at sunset |
| 12 | 👔 **Professional & LinkedIn** | Head and shoulders, crossed arms confident, sitting at desk, standing in doorway, walking hallway, coffee meeting, whiteboard gesture, window light portrait, bookshelf background, hands-in-pockets relaxed |
| 13 | 🎓 **Graduation & Campus** | Cap toss, diploma hold, gown walk, campus bench, library staircase, friend group, solo cap portrait, over-shoulder backpack, arch walkthrough, candid laughing |
| 14 | 🎄 **Festival & Celebration** | Sparkler writing, lantern hold, rangoli beside, diya lighting, fairy lights portrait, festive outfit full-length, dancing candid, food plate, bonfire sitting, flower garland |
| 15 | 🛣️ **Road Trip & Travel** | Leaning on car, sitting on hood, map reading, highway walk from behind, gas station candid, window seat bus/train, backpack traveller, luggage at airport, bike riding, roadside cafe |

---

## Technical Implementation Plan

### Task 1 — Source Royalty-Free Pose Images
- **Source**: Use **Unsplash** and **Pexels** (both provide completely free, royalty-free, no-attribution-required photos via their APIs).
- Download 10 high-quality, phone-screen-sized images (compressed JPEG, ~100–150 KB each) per category.
- Store images in the app bundle at `assets/poses/{category-slug}/pose-{01..10}.jpg`.
- Create a JSON manifest file `assets/poses/manifest.json` mapping categories to their images, titles, and descriptions.

> **Why not Pinterest?** Pinterest images are copyrighted by their uploaders and cannot be redistributed in an app. Unsplash/Pexels photos have explicit free-use licenses that allow commercial and app-bundle redistribution.

### Task 2 — Create the Pose Data Manifest
```json
{
  "categories": [
    {
      "id": "beach",
      "title": "Beach & Ocean",
      "emoji": "🏖️",
      "cover": "assets/poses/beach/pose-01.jpg",
      "poses": [
        { "id": "beach-01", "image": "assets/poses/beach/pose-01.jpg", "caption": "Walking along the shoreline" },
        ...
      ]
    },
    ...
  ]
}
```

### Task 3 — Build the "Explore Poses" Screen (`app/explore.tsx`)
- **Category Grid View**: 2-column grid of category cards with cover image, emoji, and title.
- **Search/Filter Bar**: Optional text search to filter categories.
- **Smooth scroll with momentum**, matching iOS native feel.
- Dark theme consistent with existing app design.

### Task 4 — Build the "Category Detail" Screen (`app/category.tsx`)
- Receives `categoryId` as a route param.
- Shows the 10 pose images in a vertical scrollable gallery.
- Each pose card shows the image with a caption and a **"Use as Reference"** button.
- **"Use as Reference"** navigates to `/camera?referenceUri=<local-asset-uri>`.

### Task 5 — Add "Explore Poses" Entry Point to Home Screen
- Add a prominent button/card on `app/index.tsx` (the Home / landing screen):
  `"✨ Explore Pose Ideas"` → navigates to `/explore`.
- Styled as a gradient or accent-colored card to draw attention.

### Task 6 — Optimize Bundle Size
- Compress all 150 images using `sharp` or `imagemin` to keep each under 120 KB.
- Use lazy loading (only load images for the visible category).
- Total estimated bundle size increase: ~15–18 MB (150 × ~100 KB avg).

### Task 7 — Offline-First: All Poses Work Without Internet
- Since images are bundled inside `assets/`, they ship with the app and work 100% offline.
- No API calls, no CDN, no network dependency.
- Works on both the Vercel PWA (Service Worker caches them) and native iOS build.

### Task 8 — Update Navigation & Layout
- Add `/explore` and `/category` routes to `app/_layout.tsx`.
- Ensure back navigation works cleanly: `Explore → Category → Camera → back to Category`.

### Task 9 — Typecheck, Test & Deploy
- Run `npm run typecheck` and fix all errors.
- Test full flow: Home → Explore → Pick Category → Pick Pose → Camera with overlay loaded.
- Push to GitHub → Vercel auto-deploys.

---

## UI Wireframe

```
┌─────────────────────────────┐
│  ← Back      Explore Poses  │
├─────────────────────────────┤
│  🔍 Search categories...    │
├──────────────┬──────────────┤
│ ┌──────────┐ │ ┌──────────┐ │
│ │  🏖️      │ │ │  🏔️      │ │
│ │  Beach   │ │ │ Mountains│ │
│ │  cover   │ │ │  cover   │ │
│ │ 10 poses │ │ │ 10 poses │ │
│ └──────────┘ │ └──────────┘ │
│ ┌──────────┐ │ ┌──────────┐ │
│ │  🌆      │ │ │  🌸      │ │
│ │  City    │ │ │  Garden  │ │
│ │  cover   │ │ │  cover   │ │
│ │ 10 poses │ │ │ 10 poses │ │
│ └──────────┘ │ └──────────┘ │
│        ... scroll ...       │
└─────────────────────────────┘

Tap a card ↓

┌─────────────────────────────┐
│  ← Back    🏖️ Beach & Ocean │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │   [Pose Photo 1]        │ │
│ │                         │ │
│ │  "Walking on shoreline" │ │
│ │  [ ✨ Use as Reference ] │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │   [Pose Photo 2]        │ │
│ │  "Sunset silhouette"    │ │
│ │  [ ✨ Use as Reference ] │ │
│ └─────────────────────────┘ │
│        ... scroll ...       │
└─────────────────────────────┘
```

---

## Summary

| Item | Detail |
|------|--------|
| **New Screens** | 2 — Explore grid + Category detail |
| **Categories** | 15 |
| **Poses per Category** | 10 |
| **Total Pose Images** | 150 |
| **Image Source** | Unsplash + Pexels (royalty-free) + scrap from pintrest and download them and use it |
| **Bundle Size Impact** | ~15–18 MB |
| **Works Offline** | ✅ Yes — images bundled in app |
| **Estimated Tasks** | 9 |
