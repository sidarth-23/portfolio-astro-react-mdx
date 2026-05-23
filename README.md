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

```bash
# install dependencies (bun only)
bun install

# start dev server
bun run dev
```

## Quality checks

Run this full validation pass before pushing:

```bash
bun run lint && bun run typecheck && bun run build
```

Other useful commands:

```bash
bun run format          # format .ts/.tsx/.astro
bun run preview         # preview static build
bun run start           # run built server output (dist/server/entry.mjs)
```

## Features

- **Multi-language support** — Content available in English, Spanish, and French with locale-prefixed routing and automatic redirection.
- **Content-driven blog** — MDX-based blog posts with search, tag filtering, and infinite scroll pagination.
- **Project showcase** — Filterable project listings with search, tags, and pagination; each project has its own detailed MDX page.
- **Interactive Profile** — Structured resume generated from JSON and Markdown content collections, including work experience.
- **Collapsible sidebar navigation** — Profile info, primary navigation, social links (GitHub, LinkedIn, RSS, Email), and quick actions (archive, download resume).
- **Responsive design** — Mobile-friendly layout built with Tailwind CSS.
- **SEO optimized** — Metadata helpers and structured content for search engines.
- **RSS feeds** — Per-locale RSS feed generation.
- **API endpoints** — JSON API for blog and project data with pagination, search, and tag filtering.

## Notes

- Do not edit generated output in `dist/`.
- `npm/yarn/pnpm` install is intentionally blocked; use Bun.
