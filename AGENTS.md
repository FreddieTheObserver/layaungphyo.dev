# Notes for coding agents

Read `README.md` first: it covers commands, layout, content editing and deployment.

## Rules that are easy to break

- Content lives in `content/` as Markdown or MDX, validated by `lib/content.ts`. Do not hard-code projects or posts in components.
- Style with Tailwind utilities and the theme tokens at the top of `app/globals.css` (shadcn naming: `bg-card`, `text-muted-foreground`). Add shadcn components with `pnpm dlx shadcn@latest add <name>`.
- Animations must respect reduced motion. The load-in is CSS (`.rise`), scroll reveals use `components/Reveal.tsx`, and Playwright runs with reduced motion on.
- Colors and spacing: Small text needs 4.5:1 contrast in both light and dark; the axe test enforces it, including code highlighting.
- Keep pages static. New routes should work with `next build` and no runtime server state.
- TypeScript is pinned to 6 because `typescript-eslint` does not support 7 yet.
- Use plain hyphens, never em dashes, in any text.

## Checks before handing work back

`pnpm format:check && pnpm typecheck && pnpm lint && pnpm build && pnpm test:e2e`

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
