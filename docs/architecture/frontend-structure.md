## Frontend Structure

This codebase now separates domain features, UI primitives, and core library modules by responsibility.

### Components

- `src/components/features/**`: feature and page composition (blog, projects, layout, toc, mdx, providers).
- `src/components/ui/react/**`: React primitives for client interactivity.
- `src/components/ui/astro/**`: Astro primitives for static/server-rendered UI.
- `src/components/icons/**`, `src/components/media/**`, `src/components/reui/**`: shared visual assets and vendor wrappers.

### Lib

- `src/lib/content/**`: content collection queries, locale filtering, date formatting.
- `src/lib/api/**`: API payload serialization, pagination/search/filter helpers, server fetchers.
- `src/lib/i18n/**`: translation check + translation generation + AI provider loading.
- `src/lib/seo/**`: SEO/metadata resolver.
- `src/lib/ui/**`: UI-oriented view-model composition (e.g. sidebar content).
- `src/lib/rehype/**`, `src/lib/shiki/**`, `src/lib/schemas.ts`, `src/lib/utils.ts`, `src/lib/query-client.ts`: shared infrastructure.

### Naming and import rules

- Prefer kebab-case file names for modules and non-page components.
- Import React primitives from `@/components/ui/react/*`.
- Import Astro primitives from `@/components/ui/astro/*`.
- Keep feature-level imports under `@/components/features/*`.
- Keep framework-agnostic logic in `src/lib/**` and avoid putting rendering concerns there.

## Migration map (old -> new)

- `src/components/blog/*` -> `src/components/features/blog/*`
- `src/components/project/*` -> `src/components/features/projects/*`
- `src/components/layout/*` -> `src/components/features/layout/*`
- `src/components/sections/*` -> `src/components/features/sections/*`
- `src/components/toc/*` -> `src/components/features/toc/*`
- `src/components/content/*` -> `src/components/features/content/*`
- `src/components/mdx/*` -> `src/components/features/mdx/*`
- `src/components/providers/*` -> `src/components/features/providers/*`
- `src/components/shared/card-presenters.ts` -> `src/components/features/card-presenters.ts`
- `src/components/shared/item-list-client.tsx` -> `src/components/features/listing-item-list-client.tsx`
- `src/components/shared/item-list-with-provider.tsx` -> `src/components/features/listing-item-list-with-provider.tsx`
- `src/components/shared/search-filter-bar.tsx` -> `src/components/features/listing-search-filter-bar.tsx`
- `src/components/ui/*.tsx` -> `src/components/ui/react/*.tsx`
- `src/components/ui/<primitive>/*` -> `src/components/ui/astro/<primitive>/*`
- `src/lib/content.ts` -> `src/lib/content/queries.ts`
- `src/lib/date-formatting.ts` -> `src/lib/content/date-formatting.ts`
- `src/lib/api-serialization.ts` -> `src/lib/api/serialization.ts`
- `src/lib/fetchers.ts` -> `src/lib/api/fetchers.ts`
- `src/lib/translate.ts` -> `src/lib/i18n/translate.ts`
- `src/lib/check-translations.ts` -> `src/lib/i18n/check-translations.ts`
- `src/lib/ai-providers.ts` -> `src/lib/i18n/ai-providers.ts`
- `src/lib/seo.ts` -> `src/lib/seo/metadata.ts`
- `src/lib/sidebar-content.tsx` -> `src/lib/ui/sidebar-content.tsx`
