# PX PUSH clone

A frontend clone of [pxpush.com](https://pxpush.com/) built for the Mamikos Frontend Engineer technical test (AI-assisted build).

> Work in progress. The full write-up (approach, AI workflow, decisions, API examples) will be added when the build is done.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, JavaScript, Turbopack)
- [Emotion](https://emotion.sh/) for styling (no Tailwind)
- [GSAP](https://gsap.com/) + ScrollTrigger + SplitText
- [Lenis](https://lenis.darkroom.engineering/) smooth scroll, driven by the GSAP ticker
- [three.js](https://threejs.org/) via React Three Fiber + drei
- pnpm

File convention: `.jsx` files render UI (components, pages, layouts); `.js` files are logic or data only (tokens, helpers, route handlers).

## Run locally

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build && pnpm start
pnpm lint
```

## Project structure

```
src/
  app/                  routes (layout.jsx, page.jsx)
  assets/fonts/         font files loaded with next/font/local
  components/
    effects/            CRT screen overlay (scanlines, bezel, grain)
    providers/          Emotion SSR registry, theme, Lenis + GSAP
    three/              shared three.js helpers
  lib/gsap.js           GSAP plugin registration
  styles/               design tokens, fonts, global styles
public/img/             images, video and 3D models from pxpush.com
```

## Credits

- Design, copy, images, video and fonts belong to [PX PUSH](https://pxpush.com/). Used here for a non-commercial technical test only.
- "Floppy disk" 3D model by [drumdorf](https://sketchfab.com/drumdorf), licensed [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/) ([source](https://sketchfab.com/3d-models/floppy-disk-15444a8efd38476f9457acce300edf0c)).
