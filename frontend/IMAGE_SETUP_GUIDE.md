# Image Setup Guide for Village Water System

## Background Images Added

The homepage now includes background images related to water fetching in Rwandan villages:

1. **Hero Section** - People fetching water in village setting
2. **About Section** - Village water infrastructure
3. **CTA Section** - Community water access scene

## Current Setup

Currently using placeholder images from Unsplash. To use your own local images:

### Step 1: Add Images to Project

1. Create an `images` folder in the `public` directory:
   ```
   frontend/public/images/
   ```

2. Add your images with these names (or update the paths in Homepage.js):
   - `rwanda-water-fetching.jpg` - For hero section
   - `rwanda-village-water.jpg` - For about section
   - `rwanda-community-water.jpg` - For CTA section

### Step 2: Update Image Paths

In `frontend/src/components/Homepage.js`, find these sections and uncomment the local image paths:

**Hero Section (around line 110):**
```javascript
// backgroundImage: `url('/images/rwanda-water-fetching.jpg')`,
```

**About Section (around line 200):**
```javascript
// src="/images/rwanda-village-water.jpg"
```

**CTA Section (around line 590):**
```javascript
// backgroundImage: `url('/images/rwanda-community-water.jpg')`,
```

### Step 3: Recommended Image Specifications

- **Format**: JPG or PNG
- **Hero Section**: 1920x1080px or larger (landscape)
- **About Section**: 800x600px or larger (landscape)
- **CTA Section**: 1920x800px or larger (landscape)
- **File Size**: Optimize to under 500KB each for faster loading

### Step 4: Image Sources

You can find appropriate images from:
- Unsplash (https://unsplash.com) - Search: "Rwanda water", "village water", "water fetching"
- Pexels (https://pexels.com) - Search: "Rwanda village", "water collection"
- Your own photos from Rwandan villages

### Alternative: Keep Using Unsplash URLs

The current setup uses Unsplash URLs which work immediately. If you want to keep using them, no changes are needed. The images will load automatically.

## Image Fallback

If an image fails to load, the system will automatically show a fallback gradient with a water icon, so the page will always look good even if images don't load.

## Notes

- All images have overlay gradients to ensure text remains readable
- Images are optimized with `object-cover` to maintain aspect ratio
- Background images use `bg-cover` and `bg-center` for proper display
- Dark overlays ensure white text is always visible

