# A Minimal Blocg

A personal technical blog built with Next.js (App Router) and Tailwind CSS.

I started this project with GPT-4o support, and later iterated/optimized structure and implementation with Codex.

## Requirements

- Node.js 22 (recommended; CI uses Node 22)
- npm 11+

## Quick Start

```bash
npm ci
npm run dev
```

## Build and Run

```bash
npm run lint
npm run build          # static output generated into ./out
npx serve -s out
```

## Project Structure

```text
.
├── app/
│   ├── about/
│   │   ├── content.ts              # about page data (data-only)
│   │   └── page.tsx                # about page renderer
│   ├── posts/
│   │   └── [id]/
│   │       └── page.tsx            # post detail page
│   ├── globals.css                 # design tokens + global styles
│   ├── layout.tsx                  # root layout + theme init injection
│   └── page.tsx                    # home page (post list)
├── components/
│   ├── page/
│   │   └── StructuredContent.tsx   # reusable content-heavy page primitives
│   └── Navbar.tsx                  # nav + theme mode switch + social icons
├── lib/
│   ├── posts.ts                    # markdown loading/parsing/rendering
│   └── theme.ts                    # theme types, keys, and init script
├── public/
│   └── posts/*.md                  # blog post sources
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                  # lint/build/audit/dependency-review gate
│   │   └── nextjs.yml              # GitHub Pages deployment
│   └── dependabot.yml              # automated dependency upgrades
├── next.config.mjs                 # static export config (`output: "export"`)
├── eslint.config.mjs               # ESLint flat config
└── package.json
```

## Code Architecture

1. Content source  
   Markdown posts live in `public/posts/*.md` with frontmatter metadata.

2. Content processing  
   `lib/posts.ts` reads markdown and compiles with:
   - `remark-gfm`
   - `remark-math` + `rehype-katex`
   - `rehype-starry-night` (GitHub-like syntax highlighter)
   - `rehype-raw` (trusted HTML from local-authored content only)

3. Routing and rendering  
   - `app/page.tsx`: post list from `getSortedPostsData()`
   - `app/posts/[id]/page.tsx`: post page (SSG via `generateStaticParams`)
   - `app/about/*`: data-driven about page

4. UI system  
   `app/globals.css` contains design tokens for spacing, typography, color, radius, and motion.
   It also standardizes code block presentation for both highlighted and non-highlighted fences:
   - same `pre` container shape (radius/border/padding/shadow) for both paths
   - theme-aware code palette via CSS variables (`light` uses a light code surface; `dark` uses a warm brown dark surface)

5. Theme system  
   - `lib/theme.ts`: single source of truth for theme mode/types/storage keys/init script
   - `app/layout.tsx`: injects `THEME_INIT_SCRIPT` via `next/script` (`beforeInteractive`) to avoid flash
   - `components/Navbar.tsx`: handles `Light / Dark / Auto` switching and system-sync

6. Code block behavior  
   - Unknown code fence languages stay plain text (no token coloring), avoiding inconsistent foreground/background artifacts.
   - Known languages are highlighted by Starry Night (`pl-*` classes), and colors are driven by theme variables for light/dark consistency.

## Maintenance Rules (Important for Future AI/Human Contributors)

1. Keep static export enabled  
   Do not remove `output: "export"` from `next.config.mjs` unless deployment strategy changes.

2. Keep theme contract stable  
   The UI depends on `data-theme` and `data-theme-mode` on `<html>`.  
   If theme logic changes, update both `lib/theme.ts` and `components/Navbar.tsx` consistently.

3. Do not trust untrusted markdown/HTML by default  
   `rehype-raw` is intentionally enabled for local trusted content.  
   If external/user-generated content is introduced, add sanitization before rendering.

4. Keep blog content location stable  
   `lib/posts.ts` reads from `public/posts`. If moving content, update path resolution and image rewrite rules.

5. Preserve Next 16 route typing shape  
   In dynamic app routes, `params` typing follows current Next behavior used in this repo.

## Writing a New Post

Create `public/posts/your-post-id.md`:

```md
---
title: "Your Title"
date: "2026-02-21"
tags:
  - compilers
  - notes
---

markdown content...
```

Notes:
- Use `YYYY-MM-DD` for `date` so sorting remains stable.
- Local image refs like `./figure.png` are rewritten to `/posts/figure.png`.

## CI, Security, and Dependency Updates

- CI workflow (`.github/workflows/ci.yml`) runs:
  - `npm ci`
  - `npm run lint`
  - `npm run build`
  - `npm audit --omit=dev --audit-level=high`
  - dependency review (PR only)
- Dependabot (`.github/dependabot.yml`) updates npm and GitHub Actions weekly.
- `package.json` uses `overrides` for selected transitive risk mitigation.

Recommended branch protection:
- Require `CI / Lint Build Audit`
- Require `CI / Dependency Review`

## Deployment

GitHub Pages deployment is handled by `.github/workflows/nextjs.yml`.

- Trigger: push to `master`
- Output artifact: static site in `out/`

## Attribution

- Brand icons: Font Awesome Free packages
  - `@fortawesome/free-brands-svg-icons`
  - `@fortawesome/react-fontawesome`
- Other third-party licenses are tracked via npm metadata and `package-lock.json`.
