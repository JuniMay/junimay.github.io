# A Minimal Blog

A personal technical blog built with Next.js (App Router) and Tailwind CSS.

I started this project with GPT-4o support, and later iterated/optimized structure and implementation with Codex.

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
│   ├── layout.tsx                  # root layout + theme boot script
│   └── page.tsx                    # home page (post list)
├── components/
│   ├── page/
│   │   └── StructuredContent.tsx   # reusable content-heavy page primitives
│   └── Navbar.tsx                  # nav + theme mode switch + social icons
├── lib/
│   └── posts.ts                    # markdown loading/parsing/rendering
├── public/
│   └── posts/*.md                  # blog post sources
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                  # lint/build/audit/dependency review gate
│   │   └── nextjs.yml              # GitHub Pages deployment
│   └── dependabot.yml              # automated dependency upgrades
├── next.config.mjs                 # static export config
├── eslint.config.mjs               # ESLint flat config
└── package.json
```

## Code Architecture

1. Content source  
   Markdown posts are stored in `public/posts/*.md` with frontmatter metadata.

2. Content processing (`lib/posts.ts`)  
   Server-side build/runtime reads markdown, parses frontmatter via `gray-matter`, then runs:
   - `remark-gfm` for GFM features
   - `remark-math` + `rehype-katex` for math
   - `rehype-prism-plus` for code highlighting
   - `rehype-raw` for trusted inline HTML blocks

3. Routing and rendering (`app/`)  
   - `app/page.tsx`: list page using `getSortedPostsData()`
   - `app/posts/[id]/page.tsx`: static params + post content rendering
   - `app/about/*`: data-driven profile page (content and rendering separated)

4. UI system  
   `app/globals.css` defines tokens for spacing, typography, color, radius, motion, and light/dark theme behavior.

5. Theme behavior  
   `app/layout.tsx` injects a small pre-hydration script to avoid theme flash; `components/Navbar.tsx` controls mode (`Light` / `Dark` / `Auto`) and syncs with system preference.

## Writing a New Post

Create `public/posts/your-post-id.md` with frontmatter:

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
- `date` should use sortable format `YYYY-MM-DD`.
- Local image references like `./figure.png` are rewritten to `/posts/figure.png`.

## Security and Dependency Maintenance

- CI gate (`.github/workflows/ci.yml`) runs:
  - `npm ci`
  - `npm run lint`
  - `npm run build`
  - `npm audit --omit=dev --audit-level=high`
  - dependency review on pull requests
- Dependabot (`.github/dependabot.yml`) updates:
  - npm dependencies weekly
  - GitHub Actions weekly
- `package.json` uses `overrides` for known transitive-risk packages.

## Deployment

Deployment is handled by GitHub Pages workflow:
- Workflow file: `.github/workflows/nextjs.yml`
- Trigger: push to `master`
- Output: static export in `out/`

## Attribution

- Brand icons are provided via Font Awesome Free packages:
  - `@fortawesome/free-brands-svg-icons`
  - `@fortawesome/react-fontawesome`
- Other third-party dependencies and licenses are tracked through `package-lock.json` / npm metadata.
