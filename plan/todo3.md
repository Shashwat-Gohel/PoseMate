# Phase 3 — Todo Checklist (Men & Women Pose Library)

> **Feature:** Preset Pose Library split into **Men** and **Women** sections with customizable category folders.
> **Rule:** Commit and push to GitHub after every task!

---

## 🚀 Push Protocol After Every Task:
```bash
git add .
git commit -m "feat(phase3): Task N — <short description>"
git push origin main
```

---

## Task 1 — Create Directory Structure & Placeholder Asset Slots

Create the exact folder structure under `assets/poses/` for both `men` and `women`:
- `assets/poses/men/{beach, mountains, city, cafe, sunset, monuments, roadtrip, professional, fitness, festive}`
- `assets/poses/women/{beach, mountains, city, cafe, sunset, monuments, roadtrip, professional, fitness, festive}`

Provide a lightweight starter placeholder image in each slot so that Expo bundling works seamlessly before you paste your Pinterest images.

- [ ] Create all folder paths
- [ ] Add starter image slots (`pose-01.jpg` ... `pose-10.jpg`)
- [ ] Push to GitHub

---

## Task 2 — Create the Men & Women Pose Data Manifest

**File:** `constants/poseLibrary.ts`

- [ ] Define `Gender = 'men' | 'women'`
- [ ] Define `PoseCategory` and `PoseEntry` interfaces
- [ ] Export `MEN_CATEGORIES` and `WOMEN_CATEGORIES`
- [ ] Export helper `getCategory(gender: 'men' | 'women', categoryId: string)`
- [ ] Run `npm run typecheck`
- [ ] Push to GitHub

---

## Task 3 — Register New Routes in Layout

**File:** `app/_layout.tsx`

- [ ] Add `<Stack.Screen name="explore" />`
- [ ] Add `<Stack.Screen name="category" />`
- [ ] Run `npm run typecheck`
- [ ] Push to GitHub

---

## Task 4 — Build the Explore Screen with Men / Women Switcher

**File:** `app/explore.tsx`

- [ ] Segmented Tab Switcher at top: `[ 👨 Men ]` / `[ 👩 Women ]`
- [ ] Grid of categories for the selected gender
- [ ] Category card click navigates to `/category?gender=men&categoryId=beach`
- [ ] Dark theme tokens + full accessibility labels
- [ ] Run `npm run typecheck`
- [ ] Push to GitHub

---

## Task 5 — Build Category Detail Screen

**File:** `app/category.tsx`

- [ ] Read `gender` and `categoryId` params
- [ ] Display list of poses with preview images
- [ ] "✨ Use as Reference" button resolves asset URI and navigates to `/camera?referenceUri=...`
- [ ] Run `npm run typecheck`
- [ ] Push to GitHub

---

## Task 6 — Add "Explore Poses" Button on Home Screen

**File:** `app/index.tsx`

- [ ] Add "✨ Explore Pose Ideas" button on landing screen
- [ ] Links to `/explore`
- [ ] Run `npm run typecheck`
- [ ] Push to GitHub

---

## Task 7 — Integration Testing & Final Deployment

- [ ] Run `npm run typecheck`
- [ ] Test on web / Safari PWA
- [ ] Verify you can easily drop Pinterest photos into the folders
- [ ] Final push to main & Vercel deployment
