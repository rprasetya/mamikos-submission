# PX PUSH clone

A frontend clone of [pxpush.com](https://pxpush.com/), a design-subscription studio with a CRT/old-TV look, built for the Mamikos Frontend Engineer technical test (AI-assisted build).

- **Home page** (`/`): every section of the original, in order. Hero with three.js clouds and a chrome 3D logo, intro, works showcase, stacking benefit cards, pricing with a 3D floppy disk, brand sprint, and footer.
- **Extra page** (`/start`): the original embeds a Typeform here. The clone replaces it with its own "Start a project" form, which posts to the API.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, JavaScript, Turbopack) |
| Styling | Emotion (`@emotion/styled`, SSR via a `useServerInsertedHTML` registry), no Tailwind |
| Motion | GSAP 3 (ScrollTrigger, SplitText) + Lenis smooth scroll on the GSAP ticker |
| 3D | three.js through React Three Fiber + drei |
| API | Next.js route handlers, in-memory storage |
| Package manager | pnpm |

**File convention:** `.jsx` files render UI (components, pages, layouts). `.js` files hold logic or data only (tokens, helpers, hooks, route handlers).

## Run locally

```bash
pnpm install
pnpm dev                       # http://localhost:3000
API_DELAY_MS=1500 pnpm dev     # slow the API down to see loading states
pnpm lint
pnpm build && pnpm start
```

## API

There are two endpoints; both handlers live in `src/app/api`. Every request is logged in the server terminal as `[api] METHOD path -> status`, so a failing call can be traced from the browser Network tab to the server.

### `GET /api/sections/:section`

Returns the list for one home-page section: `works` (15 showcase images), `benefits` (5 cards) or `packages` (Standard, Pro, Brand Sprint). One handler serves all three sections, which keeps the API at two endpoints. The home page fetches each list once; `packages` feeds both the pricing and the brand sprint sections.

```http
GET /api/sections/packages
```

```json
200 OK
{
  "section": "packages",
  "items": [
    {
      "id": "standard",
      "kind": "membership",
      "name": "Standard.PKG",
      "badge": null,
      "price": 3500,
      "compareAtPrice": 4000,
      "period": "mo",
      "summary": "One request at a time. First come first serve.",
      "features": ["1 request at a time", "Average 72 hour delivery", "..."],
      "cta": "Get started with Standard"
    }
  ]
}
```

An unknown section returns `404 { "error": "Unknown section \"pricing\". Use one of: works, benefits, packages." }`.

### `POST /api/inquiries`

Backs the `/start` form. The server validates and normalises the input (trims fields, lowercases the email):

| Field | Rule |
| --- | --- |
| `name` | 2–80 characters |
| `email` | valid email address |
| `company` | optional, up to 120 characters |
| `package` | `standard`, `pro` or `brand-sprint` |
| `message` | 20–2000 characters |

```http
POST /api/inquiries
Content-Type: application/json

{ "name": "Raya Prasetya", "email": "raya@example.com", "company": "Mamikos",
  "package": "pro", "message": "We need a landing page redesign and ad creatives." }
```

```json
201 Created
{
  "inquiry": { "id": "dd4844ff-…", "name": "Raya Prasetya", "email": "raya@example.com",
               "company": "Mamikos", "package": "pro", "message": "…", "createdAt": "2026-11-07T15:15:44.603Z" },
  "position": 1,
  "message": "Thanks Raya, your Pro.PKG request is in. You are #1 in the queue; we reply within one business day."
}
```

Invalid input returns `400` with a message per field:

```json
400 Bad Request
{
  "error": "Please fix the highlighted fields.",
  "fields": {
    "email": "Enter a valid email address, like name@company.com.",
    "message": "Message must be at least 20 characters."
  }
}
```

A body that is not valid JSON returns `400 { "error": "Request body must be valid JSON." }`.

**Storage and data reset:** inquiries are kept in memory in the server process. They are lost on every restart, redeploy and Vercel cold start, and each serverless instance keeps its own copy. Section data is static seed data in `src/data/sections.js`.

### Frontend states

- **GET (works, benefits, packages):**
  - While loading, each section shows a "● Loading …" line with a blinking caret.
  - On error, it shows "Signal lost" with the server's message and a Retry button.
  - To see the error state, change the URL in `useSection`, or stop the server and reload.
- **POST (`/start`):**
  - The submit button shows "Sending request…" while the request is in flight.
  - On success, the server's message is shown with the queue position.
  - On a `400`, each field shows its own error and focus moves to the first invalid field. The form uses `noValidate`, so the server is the source of truth.
  - On a network failure, a "No connection" banner appears and everything typed is kept.
  - Any other server error shows a banner with the status code.
- **Prefilled package:** the pricing CTAs link to `/start?package=<id>`, which preselects that package.

## Approach

1. **Setup first.**
   - Scaffolded Next 16 (JS, no Tailwind).
   - Wired Emotion SSR, Lenis + GSAP on one ticker, and three.js.
   - Verified everything in a headless browser before writing any feature code.
2. **Extract, don't eyeball.**
   - Downloaded the original HTML, CSS and JS bundles.
   - Took design tokens, typography, layout rules and copy straight from the original stylesheet.
   - Downloaded assets from the live site: fonts, images, videos, `cursor.obj`, `cloud10.png`, and the floppy-disk glTF.
3. **Reverse-engineer motion with a subagent.**
   - A background AI agent read the ~1 MB of minified bundles and returned a numeric spec for every effect: ScrollTrigger ranges, eases, shader uniforms, camera and light values.
   - Meanwhile, the main session built the static structure.
4. **Backend slice.** Two handlers, shared validation rules (`src/lib/inquiry.js`), and a small client (`src/lib/api.js`) that sorts failures into `network`, `validation` and `server`.
5. **Verify in a real browser.**
   - Every iteration was checked through the Chrome DevTools Protocol in headless Edge: screenshots while scrolling, console and network logs, and DOM and computed-style probes.
   - API endpoints were exercised with curl against a production build.

## Key decisions and tradeoffs

- **The "convex" CRT screen is CSS, as on the original.** The curve is `crt.png`, a curved bezel mask stretched over the viewport and scaled to 1.02. Scanlines, a 15% backdrop blur and animated grain sit on top. It is not a WebGL distortion, so text stays crisp and interactive.
- **The effects system is driven by data attributes.** `data-effect="titleRandom | textFade | fadeOut | separatorIn | overlayIn | parallax | topFade"` mirrors the original's `effect__*` directives. One hook (`useScrollEffects`) wires them up, and it re-runs when async API content arrives.
- **Stacking benefit cards use CSS `position: sticky`.** The original moves each card by hand on every Lenis scroll event; sticky gives the same resting positions with no per-frame JavaScript.
- **ScrollTriggers refresh when the page height changes.** API sections render after the first measurement, so a `ResizeObserver` calls `ScrollTrigger.refresh()`. Without it, every trigger below the API sections was offset; this was found by probing the brand-sprint frame in the browser.
- **3D scenes are isolated.** Each canvas has an error boundary, so a failed model load hides only that scene instead of unmounting the page (React 19 behaviour). The floppy scene also retries once after clearing the glTF cache.
- **The floppy's binary buffer is embedded in `scene.gltf` as a data URI.** On a first visit in Edge, the separate `scene.bin` sometimes came back to page JS as an HTTP 204 even though the server sent 200, and `GLTFLoader` rejects anything but 200. Embedding the 4.4 KB buffer removes that request.
- **Environment maps are generated locally** (PMREM + `RoomEnvironment`), so there are no remote HDR downloads.
- **`cacheComponents` is off,** so route handlers stay dynamic and never serve a build-time snapshot of in-memory data.
- **Faithful quirks kept on purpose:**
  - The original loads `cursor.obj` but never adds it to its scene, so it is not rendered here either.
  - The 3D floppy disk and the branding frame are desktop-only, as on the original.
  - The REC dot is static.

## Performance

Measured with a rAF frame counter and `longtask` observer in headless Edge on the target laptop's GPU (Intel UHD, D3D11), at 1920×1080 with 125% scaling, scrolling 10 px per frame:

| Segment | Before | After |
| --- | --- | --- |
| Hero, scrolling | 48 fps, 20 frames > 20 ms, worst 83 ms | 60 fps, 0 frames > 20 ms |
| Pricing, scrolling | one 383 ms freeze (first floppy render) | 60 fps, no freeze |
| Works, benefits, brand sprint | 60 fps | 60 fps |

What changed:
- **Clouds:**
  - The 8000-quad geometry is now built straight into typed arrays instead of cloning and merging 8000 `PlaneGeometry` objects.
  - The cloud canvas renders at 0.75× resolution. The sprites are soft, so there is no visible difference, but about 44% fewer pixels are shaded.
- **Floppy disk:**
  - Gloss maps are generated at 1024 px instead of 2048 px.
  - Shaders are compiled and textures uploaded during idle time.
  - The scene is not loaded at all on mobile, where it is hidden anyway.
- **3D logo:**
  - Lighter extrusion: `steps: 1` (side-wall subdivisions are invisible) and `curveSegments: 24`. The device pixel ratio is capped at 1.5.
  - When docked, the logo renders at a resolution matching its 25% on-screen size.
  - R3F now measures the canvas with `offsetWidth/Height`. Before, the CSS scale was applied twice and the docked logo ended up about 1/16 of its intended size.
- **CSS:**
  - The scanline jitter moved from a `background-position` animation (a full-viewport repaint at 60 fps) to a `transform` animation.
  - The fixed hero marquee that blurs out on scroll is promoted to its own layer.

## AI workflow notes

- **Tooling:** Claude Code (CLI agent) for planning, code generation, refactors and verification. One background subagent analysed the minified bundles. Headless Edge was driven through CDP scripts for visual and functional checks.
- **AI output that was caught and fixed during verification:**
  - **Lenis never scrolled.** `ReactLenis` sets its instance after the first effect, so the ticker hook bailed out. The fix reads the ref on every tick.
  - **Cloud scene hidden.** A missing `<Suspense>` inside the Canvas let texture loading suspend the outer `next/dynamic` boundary, which hid the scene with `display:none !important`.
  - **`next/link` polymorphism broken.** A custom `shouldForwardProp` made Emotion forward `as` to the DOM.
  - **Mobile horizontal overflow** from an oversized price cell, found by scanning element bounds at 390 px.
  - **Lint violations** (`react-hooks/immutability`) when mutating `scene.environment`, replaced with a declarative `<primitive attach="environment" />`.

## Project structure

```
src/
  app/                    layout.jsx, page.jsx, start/page.jsx, api/**/route.js
  assets/fonts/           font files (next/font/local)
  components/
    brand/                wordmark SVG + path data
    effects/              CRT overlay, pixel cursor
    home/                 home sections, hero clouds, 3D logo, floppy scene
    layout/               header, footer
    providers/            Emotion registry, theme, Lenis + GSAP
    start/                /start page and form
    three/                canvas error boundary, environment map
    ui/                   primitives, buttons, marquee, overlays, status states
  data/sections.js        seed data for GET /api/sections/:section
  hooks/                  useSection (GET + retry), useScrollEffects
  lib/                    api client, validation rules, gsap, scramble, format
  styles/                 tokens, fonts, global styles
public/img/               images, video, 3D models from pxpush.com
```

## Credits

- Design, copy, images, video and fonts belong to [PX PUSH](https://pxpush.com/). They are used here only for a non-commercial technical test. The site is marked `noindex`.
- "Floppy disk" 3D model by [drumdorf](https://sketchfab.com/drumdorf), licensed [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/) ([source](https://sketchfab.com/3d-models/floppy-disk-15444a8efd38476f9457acce300edf0c)).
