# AGENTS

## Stack + boundaries
- Astro 5 site with React islands (`@astrojs/react`); default to `.astro` for static UI and use `.tsx` only for interactive client logic.
- Team rule: prefer Fulldev UI components/patterns first; use raw React/shadcn only where interactivity is required.
- Content-driven architecture: Astro content collections are the source of truth (`blog`, `projects`, `cv`, `cvExperience`) in `src/content.config.ts` and `src/content/**`.
- i18n is required across routes/content: locales are `en`, `es`, `fr` (`src/i18n/config.ts`), with locale-prefixed routing enabled in `astro.config.mjs`.

## Commands agents should use
- Install deps: `bun install` (enforced by `preinstall`; npm/yarn/pnpm will fail).
- Dev server: `bun run dev`.
- Validation pass: `bun run lint && bun run typecheck && bun run build`.
- Production run after build: `bun run start` (serves `dist/server/entry.mjs`).
- Formatting: `bun run format`.

## Translation workflow (build-critical)
- Build runs a translation consistency check via `translateIntegration`; missing/stale translations fail the build.
- Fix content translations with `bun run translate` (or `bun run translate:force`).
- Translation commands require `AI_API_KEY`; optional `AI_MODEL` / `AI_API_URL` are supported.

## Real entrypoints to edit
- Pages/routes: `src/pages/**` (root redirects to `/${defaultLocale}` in `src/pages/index.astro`).
- Shared layout shell: `src/layouts/Layout.astro` + `src/components/layout/app-shell.tsx`.
- Client-side filtered lists use API + React Query: `src/pages/api/*.json.ts` + `src/components/*/*-list-with-provider.tsx`.

## Guardrails
- Do not edit generated output in `dist/`.
- Keep locale/content changes synchronized across `en`, `es`, and `fr` to avoid translation-check build failures.
