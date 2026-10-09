# Notes for coding agents

Read `README.md` first: it covers commands, layout, content editing and deployment.

## Rules that are easy to break

- Whitespace between inline elements is rendered. Keep prompt lines and similar markup on one line, and use `nb()` from `src/lib/text.ts` for deliberate runs of spaces.
- Do not run Prettier on `.astro` files (they are in `.prettierignore` on purpose).
- Keep `compressHTML: true` in `astro.config.mjs`.
- Scoped styles do not reach a child component's root, because Astro scopes with an attribute. Style a child through the parent, e.g. `.parent > :global(.child-class)`.
- ASCII art (banner, portrait, diagrams) is generated SVG from `src/lib/ascii.ts`. Do not turn it back into `<pre>` text.
- A rule like `display: flex` overrides the `hidden` attribute, so add `[hidden] { display: none }` where needed.
- Colors come from `src/styles/tokens.css`. Small text needs 4.5:1 contrast on paper, paper-sunk and card; the axe test enforces it.

## Checks before handing work back

`pnpm format:check && pnpm check && pnpm build && pnpm test:e2e`

## Development server

Astro 7 allows one dev or preview server per project. Start it in the background with `astro dev --background` and manage it with `astro dev stop|status|logs`.

Astro documentation: https://docs.astro.build
