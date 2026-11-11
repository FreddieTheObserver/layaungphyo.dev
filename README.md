# layaungphyo.dev

The personal site of La Yaung Phyo (Freddie), a backend and systems engineer in Bangkok.
A one-page portfolio at `/` (work, about, now, contact) plus a blog at `/blog`.

## Stack

- Next.js 16 (App Router), React 19, TypeScript in strict mode.
- Tailwind CSS 4 and shadcn/ui (components in `components/ui`), with design tokens in `app/globals.css`.
- Light and dark themes with a toggle (`next-themes`), light by default.
- Motion for scroll reveals and the scroll progress bar, CSS keyframes for the load-in animation.
- Plus Jakarta Sans and JetBrains Mono, self-hosted by `next/font/google` at build time.
- Content is Markdown and MDX files in git, rendered on the server with `next-mdx-remote` and Shiki.
- Playwright and axe for end-to-end and accessibility tests.
- Deployed on Vercel.

## Commands

Run everything from the project root with Node 22 (see `.nvmrc`) and pnpm 10.

| Command          | What it does                                        |
| :--------------- | :-------------------------------------------------- |
| `pnpm install`   | Install dependencies.                               |
| `pnpm dev`       | Start the dev server on `localhost:3000`.           |
| `pnpm build`     | Production build.                                   |
| `pnpm start`     | Serve the production build.                         |
| `pnpm typecheck` | Type-check with TypeScript.                         |
| `pnpm lint`      | Run ESLint.                                         |
| `pnpm test:e2e`  | Run Playwright on desktop and mobile (build first). |
| `pnpm format`    | Format everything with Prettier.                    |

Playwright needs a browser once: `pnpm exec playwright install chromium`.

## Layout

```text
app/                 routes: / , /blog , /blog/[slug] , rss, sitemap, robots
components/          Header, Footer, ProjectCard, Mdx renderer, theme and motion helpers
components/ui/       shadcn/ui components
content/projects/    one Markdown file per project
content/posts/       one MDX file per blog post
lib/site.ts          name, links, skills, principles, "now" list
lib/content.ts       reads and validates content files
public/              static files (résumé PDF, project media)
tests/               Playwright and axe tests
```

## Editing content

### Projects

Add `content/projects/<slug>.md`.
Frontmatter: `order`, `name`, `status` (`Live`, `In progress`, `Design`, `Study`), `summary`, `stack`, optional `links`.
Add a screenshot, GIF or short video with `media: { src: /projects/x.gif, alt: "...", kind: image }` and put the file in `public/projects/`.
Use `kind: video` for an mp4 or webm, which autoplays muted and loops.

### Blog posts

Add `content/posts/<slug>.mdx`.
Frontmatter: `title`, `description`, `date` (YYYY-MM-DD), optional `tags`, and `draft: true` to hide it in production.
Drafts are visible in `pnpm dev`.
The post is added to the blog index, RSS feed and sitemap automatically.

### Placeholders to replace before launch

- `site.linkedin` in `lib/site.ts` is `null`, so no LinkedIn link is shown.
- `public/freddie-resume.pdf` does not exist yet, and the résumé links point there.
- `hello@layaungphyo.dev` only receives mail once forwarding is set up at Name.com.

## Deployment

Import the repository in Vercel and keep the defaults.
Then point the domain at Vercel from Name.com.
CI (`.github/workflows/ci.yml`) runs format, type, lint, build and e2e checks on every push and pull request.
