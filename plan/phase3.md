# Phase 3 — Preset Pose Library (Men & Women)

> **Goal:** Provide a curated gallery of pose ideas organized into **Men** and **Women** sections across diverse location/style categories. The user manually drops in their preferred Pinterest images into clearly organized folders, and the app displays them as ready-to-use ghost overlays!

---

## Architecture: Two Primary Sections (Men & Women)

The "Explore Poses" screen features an iOS segmented control / tab switcher at the top:
- 👨 **Men**
- 👩 **Women**

Under each section, poses are organized by scene / category.

---

## Categories per Section

Both **Men** and **Women** sections will have the categories:
1. 🏖️ **Beach & Ocean** (`beach`)
2. 🏔️ **Mountains & Hiking** (`mountains`)
3. 🌆 **City & Urban** (`city`)
4. ☕ **Café & Lifestyle** (`cafe`)
5. 🌅 **Sunset & Golden Hour** (`sunset`)
6. 🏛️ **Monuments & Travel** (`monuments`)
7. 🚗 **Car & Road Trip** (`roadtrip`)
8. 👔 **Professional & Formals** (`professional`)
9. 🏋️ **Fitness & Gym** (`fitness`)
10. 🎉 **Party & Festive** (`festive`)

---

## Folder Structure for Manual Image Placement

All images will be placed in `assets/poses/`:

```
assets/poses/
├── men/
│   ├── beach/       (pose-01.jpg ... pose-10.jpg)
│   ├── mountains/   (pose-01.jpg ... pose-10.jpg)
│   ├── city/        ...
│   ├── cafe/
│   ├── sunset/
│   ├── monuments/
│   ├── roadtrip/
│   ├── professional/
│   ├── fitness/
│   └── festive/
└── women/
    ├── beach/       (pose-01.jpg ... pose-10.jpg)
    ├── mountains/   ...
    ├── city/
    ├── cafe/
    ├── sunset/
    ├── monuments/
    ├── roadtrip/
    ├── professional/
    ├── fitness/
    └── festive/
```

> **How you add images:** Simply save any photo from Pinterest as `pose-01.jpg`, `pose-02.jpg`, etc., directly inside that category folder! We'll provide clean starter placeholders so the app builds and works out of the box right away.

---

## Technical Flow
1. **Home Screen**: "✨ Explore Pose Ideas" button.
2. **Explore Screen (`app/explore.tsx`)**:
   - Top Segmented Tab: `[ 👨 Men ]` | `[ 👩 Women ]`
   - Category grid cards showing category emoji, title, and cover image.
3. **Category Detail Screen (`app/category.tsx`)**:
   - Shows poses for that specific gender and category.
   - Each pose card has a **"Use as Reference"** button.
   - Tapping it loads the photo as the camera's ghost overlay immediately!
