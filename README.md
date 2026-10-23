# SANMEDIA

A cinematic film production website built with Next.js App Router, React,
TypeScript and Tailwind CSS. All imagery, brand assets and fonts are served
locally. GSAP enhances the desktop film sequences; mobile and reduced-motion
layouts keep the complete narrative in normal document flow.

Desktop wheel scrolling uses the original site's 1.25-second Lenis easing.
Scroll-driven sequences restore the expanding hero crop, image zoom, service
crossfades, rising process titles, staggered section reveals and word-by-word
statement. Touch, keyboard navigation and reduced-motion preferences retain
native scrolling; dialogs and route changes cancel any remaining momentum.

## Local development

Use Node.js 22 LTS (see `.nvmrc`).

```sh
npm ci
npm run dev
```

Open http://localhost:8080. In the current workspace, `./dev.local` also uses the
workspace's isolated Node.js installation when present.

## Production

```sh
npm run build
npm start
```

The production server uses port 8080 and supports standard Next.js hosting.
Set `SITE_URL` to the real public origin before building
to generate production sitemap URLs. See `.env.example`.

## Routes and structure

- `/` — the cinematic overview
- `/work` — the six-film collection and project detail dialogs
- `/services` — six production formats and three production scales
- `/process` — the four chapters from idea to finished film
- `/about` — the production house and behind-the-scenes gallery
- `/contact` — the original direct email contact flow

`src/app` owns routing, metadata and error boundaries. `src/content` contains the
film, service and process content. `src/components/sanmedia` holds the shared
sections, header, footer and accessible native dialogs. Original photographs
live in `src/assets`; logos live in `public/images`. Font licenses are bundled
alongside the local WOFF2 files.

Navigation uses Next.js links with active page indicators. Dialogs trap focus,
restore it on dismissal and support Escape. Animations respect reduced motion
and clean up their observers and timelines on route changes. Contact links open
the visitor's email application; no form submission service is configured.

## Verification

```sh
npm run typecheck
npm test
```

Browser tests use a locally installed Google Chrome, with desktop and touch
mobile projects. They cover routes, metadata, image loading, navigation, modal
focus, reduced motion, small screens, no-JavaScript content and 404 recovery.
Tests reuse the local development server or start one if needed. To verify an
already running production server, set `PLAYWRIGHT_BASE_URL` to its URL.
