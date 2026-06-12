import { type Locale } from "@/i18n/config"

import { buildSearchIndexExport, type SearchIndexExport } from "./flexsearch"
import { buildSearchDocuments, type SearchCorpusInput } from "./search"

export type SearchExportsByLocale = Record<Locale, SearchIndexExport>

export function buildSearchExports(
  corpusByLocale: Record<Locale, SearchCorpusInput>
): SearchExportsByLocale {
  const exportsByLocale = {} as SearchExportsByLocale

  for (const [locale, corpus] of Object.entries(corpusByLocale) as Array<
    [Locale, SearchCorpusInput]
  >) {
    exportsByLocale[locale] = buildSearchIndexExport(
      buildSearchDocuments(corpus)
    )
  }

  return exportsByLocale
}
