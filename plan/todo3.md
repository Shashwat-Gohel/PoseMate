# Phase 3 — Todo Checklist (Step-by-Step Coding Guide)

> **Feature:** Preset Pose Library — 15 categories × 10 poses = 150 curated reference images.
> **Reference Plan:** `phase3.md`

---

## ⚠️ RULE: Push After Every Task

After completing each task, **always commit and push to GitHub** to trigger a Vercel deploy and keep a clean commit history:

```bash
git add .
git commit -m "feat(phase3): Task N — <short description>"
git push origin main
```

This ensures:
- Every task has its own commit for easy rollback
- Vercel builds and deploys incrementally
- More GitHub contribution activity (green squares!)

---

## Pre-requisites

- All Phase 2 tasks complete ✅
- Existing routes: `index.tsx`, `camera.tsx`, `preview.tsx`, `settings.tsx`, `_layout.tsx`
- Theme tokens: `constants/theme.ts` (use `colors`, `radii`, `spacing`, `typography`)
- Camera screen accepts `referenceUri` route param (already works)

---

## Task 1 — Download & Organize Pose Images

**Directory structure:**
```
assets/poses/
  beach/
    pose-01.jpg
    pose-02.jpg
    ...
    pose-10.jpg
  mountains/
    pose-01.jpg
    ...
  city/
    ...
  (15 folders × 10 images = 150 files)
```

**Image requirements:**
- Source: **Unsplash** (`https://unsplash.com`) or **Pexels** (`https://pexels.com`) — both free, royalty-free, no attribution required for app bundles.
- Format: JPEG
- Resolution: 720×960 px (portrait orientation, optimized for phone screens)
- Max file size: 120 KB each (use compression)
- Total estimated bundle: ~15 MB

**Search queries per category:**
- `beach` → "beach pose photography", "ocean portrait"
- `mountains` → "hiking summit pose", "mountain portrait"
- `city` → "urban street portrait", "city fashion photo"
- `garden` → "flower garden portrait", "botanical photo shoot"
- `cafe` → "coffee shop portrait", "cafe lifestyle"
- `sunset` → "golden hour portrait", "sunset silhouette"
- `monuments` → "architecture portrait", "monument travel photo"
- `pool` → "poolside portrait", "tropical vacation photo"
- `waterfall` → "waterfall portrait", "forest nature photo"
- `amusement` → "amusement park photo", "carnival portrait"
- `yoga` → "yoga pose outdoor", "fitness portrait"
- `professional` → "professional headshot", "linkedin portrait"
- `graduation` → "graduation portrait", "campus college photo"
- `festival` → "festival celebration photo", "cultural festive portrait"
- `roadtrip` → "road trip portrait", "travel adventure photo"

**Checklist:**
- [ ] Create all 15 subdirectories under `assets/poses/`
- [ ] Download 10 images per category (150 total)
- [ ] Resize all to 720×960 portrait JPEG
- [ ] Compress each to under 120 KB
- [ ] Name them consistently: `pose-01.jpg` through `pose-10.jpg`

**🚀 Push:**
```bash
git add .
git commit -m "feat(phase3): Task 1 — add 150 curated pose images in 15 categories"
git push origin main
```

---

## Task 2 — Create the Pose Data Manifest

**File:** `constants/poseLibrary.ts`

Create a TypeScript data file defining all 15 categories and 10 pose entries each.
Each pose entry has: `id`, `image` (require() for local asset), `caption` (short description).
Each category has: `id` (slug), `title`, `emoji`, `poses[]`.

```ts
export interface PoseEntry {
  id: string;
  image: any; // require() return type
  caption: string;
}

export interface PoseCategory {
  id: string;
  title: string;
  emoji: string;
  poses: PoseEntry[];
}

export const POSE_CATEGORIES: PoseCategory[] = [
  {
    id: 'beach',
    title: 'Beach & Ocean',
    emoji: '🏖️',
    poses: [
      { id: 'beach-01', image: require('@/assets/poses/beach/pose-01.jpg'), caption: 'Walking along the shoreline' },
      // ... 9 more
    ],
  },
  // ... 14 more categories
];

export const getCategoryById = (id: string): PoseCategory | undefined =>
  POSE_CATEGORIES.find((c) => c.id === id);
```

**Categories to implement:**
1. `beach` — Beach & Ocean 🏖️
2. `mountains` — Mountains & Hiking 🏔️
3. `city` — City & Urban 🌆
4. `garden` — Garden & Flowers 🌸
5. `cafe` — Café & Restaurant ☕
6. `sunset` — Sunset & Golden Hour 🌅
7. `monuments` — Monuments & Architecture 🏛️
8. `pool` — Pool & Tropical 🌊
9. `waterfall` — Waterfall & Forest 🏞️
10. `amusement` — Amusement & Fun 🎡
11. `yoga` — Yoga & Fitness 🧘
12. `professional` — Professional & LinkedIn 👔
13. `graduation` — Graduation & Campus 🎓
14. `festival` — Festival & Celebration 🎄
15. `roadtrip` — Road Trip & Travel 🛣️

**Checklist:**
- [ ] Create the TypeScript interfaces
- [ ] Define all 15 category objects with their 10 poses each
- [ ] Use `require()` for each image (Expo/Metro bundler resolves these at build time)
- [ ] Export `POSE_CATEGORIES` and a helper `getCategoryById(id: string)`
- [ ] Verify every `require()` path resolves without error
- [ ] Run `npm run typecheck` — fix all errors

**🚀 Push:**
```bash
git add .
git commit -m "feat(phase3): Task 2 — create pose data manifest with 15 categories"
git push origin main
```

---

## Task 3 — Register New Routes in Layout

**File:** `app/_layout.tsx`

**Checklist:**
- [ ] Add `<Stack.Screen name="explore" />` inside the `<Stack>` component
- [ ] Add `<Stack.Screen name="category" />` inside the `<Stack>` component
- [ ] Both should have `headerShown: false` (already set via `screenOptions`)
- [ ] Run `npm run typecheck` — fix all errors

**🚀 Push:**
```bash
git add .
git commit -m "feat(phase3): Task 3 — register explore and category routes"
git push origin main
```

---

## Task 4 — Build the Explore Screen

**File:** `app/explore.tsx`

This is the category browse page — a 2-column grid of category cards.

**UI structure:**
```
SafeAreaView (dark bg)
├── NavBar: "← Back" + "Explore Poses" title
├── Search input (optional filter — filters categories by title)
└── ScrollView
    └── 2-column FlatList/grid of category cards
        Each card:
        ├── Cover image (first pose image from category)
        ├── Emoji + Title overlay
        └── "10 poses" count badge
        onPress → router.push('/category?categoryId=beach')
```

**Checklist:**
- [ ] Create `app/explore.tsx` as a functional component
- [ ] Import `POSE_CATEGORIES` from `constants/poseLibrary`
- [ ] Render a 2-column grid using `FlatList` with `numColumns={2}`
- [ ] Each card uses the first pose image as cover thumbnail
- [ ] Category title + emoji overlaid at the bottom of the card
- [ ] Add `accessibilityLabel` to every `Pressable`
- [ ] Dark theme: use `colors.background`, `colors.text`, `colors.accent` from theme
- [ ] Card border radius: `radii.lg` (20)
- [ ] On card press: `router.push({ pathname: '/category', params: { categoryId } })`
- [ ] Add optional search bar at top that filters categories by title
- [ ] Run `npm run typecheck` — fix all errors

**🚀 Push:**
```bash
git add .
git commit -m "feat(phase3): Task 4 — build explore poses category grid screen"
git push origin main
```

---

## Task 5 — Build the Category Detail Screen

**File:** `app/category.tsx`

Shows all 10 poses in a selected category as a vertical scrollable gallery.

**UI structure:**
```
SafeAreaView (dark bg)
├── NavBar: "← Back" + "🏖️ Beach & Ocean" title
└── ScrollView (vertical)
    └── For each pose:
        ├── Pose image (full-width, aspect ratio preserved)
        ├── Caption text below image
        └── "✨ Use as Reference" button
            onPress → router.push('/camera?referenceUri=<asset-uri>')
```

**Checklist:**
- [ ] Create `app/category.tsx` as a functional component
- [ ] Read `categoryId` from `useLocalSearchParams`
- [ ] Look up category from `POSE_CATEGORIES` using `getCategoryById()`
- [ ] Show "Category not found" fallback if categoryId is invalid
- [ ] Render nav bar with emoji + title from category data
- [ ] Use `ScrollView` or `FlatList` to render all 10 pose cards
- [ ] Each pose card: full-width `Image` + caption `Text` + "Use as Reference" `Pressable`
- [ ] "Use as Reference" button: styled with `colors.accent` background, black text
- [ ] On button press: resolve the `require()` image to a URI using `Asset.fromModule(image).uri` (from `expo-asset`), then navigate to camera:
  ```ts
  import { Asset } from 'expo-asset';
  const asset = Asset.fromModule(pose.image);
  await asset.downloadAsync();
  router.push({ pathname: '/camera', params: { referenceUri: asset.localUri ?? asset.uri } });
  ```
- [ ] Add `accessibilityLabel` to every `Pressable`
- [ ] Run `npm run typecheck` — fix all errors

**🚀 Push:**
```bash
git add .
git commit -m "feat(phase3): Task 5 — build category detail screen with use-as-reference flow"
git push origin main
```

---

## Task 6 — Add "Explore Poses" Button to Home Screen

**File:** `app/index.tsx`

Add a prominent entry point card between the reference picker section and the "Open Camera" button.

**UI:**
```
┌─────────────────────────────────┐
│  ✨ Explore Pose Ideas          │
│  150 curated poses in 15 styles │
│                           →     │
└─────────────────────────────────┘
```

**Checklist:**
- [ ] Add a new `Pressable` card styled with a subtle accent gradient/border
- [ ] Text: "✨ Explore Pose Ideas" (title) + "150 curated poses in 15 styles" (subtitle)
- [ ] Right-aligned chevron arrow icon
- [ ] `onPress={() => router.push('/explore')}`
- [ ] Place it after the "Choose from Photos" section and before the "Open Camera" button
- [ ] Add `accessibilityLabel="Explore Pose Ideas"`
- [ ] Run `npm run typecheck` — fix all errors

**🚀 Push:**
```bash
git add .
git commit -m "feat(phase3): Task 6 — add explore poses entry point on home screen"
git push origin main
```

---

## Task 7 — Optimize Images for Bundle Size

**Checklist:**
- [ ] Use `sharp` or an online batch compressor to resize all 150 images to 720×960
- [ ] Compress all to JPEG quality 75-80 (target ≤ 120 KB each)
- [ ] Verify total `assets/poses/` folder size is under 20 MB
- [ ] Remove any EXIF metadata from images to save space
- [ ] Test that all images display correctly in the app

**🚀 Push:**
```bash
git add .
git commit -m "chore(phase3): Task 7 — optimize and compress all 150 pose images"
git push origin main
```

---

## Task 8 — Ensure Offline Support (Service Worker Update)

**File:** `public/sw.js`

The existing Service Worker uses a Cache-First strategy and will automatically cache the pose images when they are loaded. No changes needed if images are bundled via `require()`.

**Checklist:**
- [ ] Verify the Service Worker caches the new JS bundles that contain the pose image references
- [ ] Test offline: load the app online → go to Explore → open a category → turn off internet → images should still display
- [ ] If images are loaded via network URLs (not `require()`), add them to the Service Worker precache list

**🚀 Push:**
```bash
git add .
git commit -m "chore(phase3): Task 8 — verify offline support for pose library"
git push origin main
```

---

## Task 9 — Final Integration Test & Deploy

**Checklist:**
- [ ] Run `npm run typecheck` — zero errors
- [ ] Test full flow on web:
  - Home → "Explore Pose Ideas" → Category Grid → Tap "Beach" → Scroll poses → Tap "Use as Reference" → Camera opens with pose overlay → Align → Capture → Preview → Save
- [ ] Test navigation: Back button from Category → Explore, Back from Explore → Home
- [ ] Test search/filter on Explore page
- [ ] Verify dark theme is consistent across new screens
- [ ] Verify Vercel deploys successfully
- [ ] Test on iPhone Safari — full flow end to end

**🚀 Final Push:**
```bash
git add .
git commit -m "feat(phase3): Task 9 — final integration test, pose library complete"
git push origin main
```

---

## Important Coding Rules (Carry Over from Phase 2)

1. **Never hardcode pixel colors** — always use tokens from `constants/theme.ts`
2. **Never add npm packages** unless explicitly required by a task
3. **Run `npm run typecheck`** after every code change and fix all errors before moving on
4. **iOS dark theme** must be maintained: `colors.background = '#000000'`, accent = `'#FFD60A'`
5. **Every `Pressable`** must have `accessibilityLabel`
6. **Functional components only**, no class components
7. **Use `expo-asset` `Asset.fromModule()`** to resolve bundled image URIs for the camera route param
8. **Use `require()`** for all local images — do NOT use network URLs for pose images
9. **Push to GitHub after every task** — commit message format: `feat(phase3): Task N — <short description>`

---

## Task Dependency & Execution Order

```
Task 1 (Download images)
    ↓
Task 2 (Data manifest — needs image paths)
    ↓
Task 3 (Register routes)
    ↓
Task 4 (Explore screen) ──┐
Task 5 (Category screen) ─┤
Task 6 (Home button) ─────┘
    ↓
Task 7 (Optimize images)
    ↓
Task 8 (Offline verification)
    ↓
Task 9 (Final test & deploy)
```

**Execute in this order:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

**Total GitHub pushes from Phase 3: 9 commits** 🟩🟩🟩🟩🟩🟩🟩🟩🟩
