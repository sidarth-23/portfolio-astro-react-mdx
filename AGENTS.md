# AGENTS

## Stack + boundaries
- Astro 6 site with React islands (`@astrojs/react`); default to `.astro` for static UI and use `.tsx` only for interactive client logic.
- Team rule: prefer Fulldev UI components/patterns first; use raw React/shadcn only where interactivity is required.
- Content-driven architecture: Astro content collections are the source of truth (`blog`, `projects`, `profile`, `profileExperience`) in `src/content.config.ts` and `src/content/**`.
- i18n is required across routes/content: locales are `en`, `es`, `fr` (`src/i18n/config.ts`), with locale-prefixed routing enabled in `astro.config.mjs`.

## Commands agents should use
- Install deps: `bun install` (enforced by `preinstall`; npm/yarn/pnpm will fail).
- Dev server: `bun run dev`.
- Validation pass: `bun run lint && bun run typecheck && bun run build`.
- Preview built output: `bun run preview` (serves via Wrangler locally).
- Formatting: `bun run format`.

## Real entrypoints to edit
- Pages/routes: `src/pages/**` (root redirects to `/${defaultLocale}` in `src/pages/index.astro`).
- Shared layout shell: `src/layouts/base/Layout.astro` + `src/layouts/shell/app-shell.tsx`.
- Client-side filtered lists use API + React Query: `src/pages/api/*.json.ts` + `src/components/*/*-list-with-provider.tsx`.

## Agent Rules
- Write comments only to explain why code is written in a non-obvious way; do not write organizational or summarizing comments.
- Prefer adding functionality to existing files unless the change is a new logical component. Avoid creating many small files.
- Write unit tests and e2e tests for all new functionality and bug fixes.
- Always verify the code you wrote by running the appropriate checks (lint, typecheck, build) before considering a task complete.

## Guardrails
- Do not edit generated output in `dist/`.
