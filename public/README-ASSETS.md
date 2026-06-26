# Storefront image assets (placeholders)

The public storefront references these images. Until real files are dropped in,
the UI degrades gracefully (dark gradients / neutral placeholders).

## Hero (homepage scroll slider) — required for full effect
- `public/hero/hero-1.jpg`  — slide 1 (woman holding bag / dark fashion shot)
- `public/hero/hero-2.jpg`  — slide 2 (quilted bags)
- `public/hero/hero-3.jpg`  — slide 3 (row of colored bags)
Recommended: 1920×1280+, landscape, will be darkened by an overlay.

## About section
- `public/about.jpg`        — portrait production/brand photo (3:4)

## Reviews carousel
- `public/reviews/review-1.jpg` … `public/reviews/review-6.jpg`
  Customer review screenshots (portrait 3:4). Add/remove by editing
  `components/storefront/reviews-carousel.tsx` (REVIEWS array).

## Optional
- `public/hero.jpg` (legacy single hero — no longer used)
