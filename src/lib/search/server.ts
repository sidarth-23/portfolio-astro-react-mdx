import type { Locale } from "@/i18n/config"

import {
  importSearchEngine,
  type SearchEngine,
  type SearchExportPayload,
} from "./flexsearch"

// One chunk per locale: the worker isolate only parses the export for
// locales that actually get queried.
const loaders = import.meta.glob<{ default: SearchExportPayload }>(
  "/src/generated/search.*.json"
)

const engineCache = new Map<Locale, Promise<SearchEngine>>()

export function getSearchEngine(locale: Locale): Promise<SearchEngine> {
  const cached = engineCache.get(locale)
  if (cached) return cached

  const loader = loaders[`/src/generated/search.${locale}.json`]
  if (!loader) {
    throw new Error(
      `Missing search export for locale: ${locale}. Run "bun run search:generate".`
    )
  }

  const engine = loader().then((module) => importSearchEngine(module.default))
  engineCache.set(locale, engine)
  return engine
}
