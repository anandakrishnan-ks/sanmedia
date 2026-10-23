# SANMEDIA

Next.js App Router, TypeScript, and Tailwind CSS. Keep the cinematic monochrome
identity and existing project content. Use Server Components by default and
isolate browser interactions in Client Components. Images and fonts are local.

Respect reduced motion, keyboard access, and mobile layouts. Use native links
for navigation and native dialogs for modal focus management. Clean up all
animation observers and timelines when a component unmounts.

Run the production build, TypeScript checks, and relevant browser tests after
structural changes. Preserve published Git history; do not force-push or rewrite
existing commits.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
