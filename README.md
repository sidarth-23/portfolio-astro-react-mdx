# Sid's Hub - Astro + MDX Portfolio

[![Live Site](https://img.shields.io/badge/Live-sidshub.in-0b7285?style=flat-square)](https://sidshub.in)
[![Bun](https://img.shields.io/badge/Bun-1.2%2B-f9f1e1?logo=bun&logoColor=111&style=flat-square)](https://bun.sh)
[![Astro](https://img.shields.io/badge/Astro-6.x-1e1b4b?logo=astro&style=flat-square)](https://astro.build)

This repository powers [sidshub.in](https://sidshub.in) as a content-driven Astro site.

The project has moved away from CMS-driven content and now uses **MDX + Astro content collections** as the source of truth, with React used only for interactive islands.

## What changed

- Old direction: Astro + external CMS workflow.
- Current direction: Astro + MDX-only content workflow inside this repo.
- Team rule: prefer Fulldev UI patterns/components first; use React/shadcn only where interactivity is required.

## Stack

- Astro 6 + TypeScript (strict)
- MDX (`@astrojs/mdx`)
- React islands (`@astrojs/react`) for interactive components
- Tailwind CSS 4
- Bun as the required package manager/runtime

## Content model

Astro content collections are defined in `src/content.config.ts`:

- `blog` (MDX)
- `projects` (MDX)
- `profile` (JSON data)
- `profileExperience` (Markdown)

Content lives under `src/content/**` and is locale-aware.

## Internationalization

- Supported locales: `en`, `es`, `fr`
- Locale-prefixed routing is enabled (including default locale).
- Root route redirects to `/${defaultLocale}`.

## Local development

# install dependencies (bun only)
bun install

# copy env example and set SITE_URL
cp .env.example .env
# edit .env to set SITE_URL to the canonical origin for your environment

# start dev server (requires SITE_URL in .env or process environment)
bun run dev

## Quality checks

Run this full validation pass before pushing:

```bash
SITE_URL=https://sidshub.in bun run lint && SITE_URL=https://sidshub.in bun run typecheck && SITE_URL=https://sidshub.in bun run build
```

Other useful commands:

```bash
bun run format          # format .ts/.tsx/.astro
bun run preview         # preview production build via Wrangler locally
```

## OG image generation

Open Graph images are generated automatically and written to `public/og`.

- Build hook: `astro.config.mjs` runs `bun scripts/generate-og-images.ts` at `astro:build:start`.
- Generated page OGs: from `src/content/page-seo.json` as `og-{page}-{locale}.png` (for `en`, `es`, `fr`).
- Generated content OGs: for `blog` and `projects` MDX entries, including localized slugs.
- Content requirements: frontmatter needs `locale`, title/description (`seo` or fallback fields), and `coverImage`.

To regenerate manually:

```bash
bun scripts/generate-og-images.ts
```

## Features

- **Multi-language support** — Content available in English, Spanish, and French with locale-prefixed routing and automatic redirection.
- **Content-driven blog** — MDX-based blog posts with search, tag filtering, and infinite scroll pagination.
- **Project showcase** — Filterable project listings with search, tags, and pagination; each project has its own detailed MDX page.
- **Interactive Profile** — Structured resume generated from JSON and Markdown content collections, including work experience.
- **Collapsible sidebar navigation** — Profile info, primary navigation, social links (GitHub, LinkedIn, RSS, Email), and quick actions (archive, download resume).
- **Responsive design** — Mobile-friendly layout built with Tailwind CSS.
- **SEO optimized** — Metadata helpers and structured content for search engines.
- **Automated OG images** — Build-time Open Graph image generation for pages and MDX content.
- **RSS feeds** — Per-locale RSS feed generation.
- **API endpoints** — JSON API for blog and project data with pagination, search, and tag filtering.

## Notes

- Do not edit generated output in `dist/`.
- `npm/yarn/pnpm` install is intentionally blocked; use Bun.
