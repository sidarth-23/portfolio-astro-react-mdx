import pageSeoJson from "@/content/page-seo.json"

export type PageSeoConfig = typeof pageSeoJson

export function getPageSeo(page: string, locale: string): { title: string; description: string } {
  const config = pageSeoJson as PageSeoConfig
  const pageConfig = config[page as keyof PageSeoConfig]
  if (!pageConfig) {
    throw new Error(`No SEO config found for page: ${page}`)
  }
  const localeConfig = pageConfig[locale as keyof typeof pageConfig]
  if (!localeConfig) {
    throw new Error(`No SEO config found for page ${page} locale ${locale}`)
  }
  return localeConfig as { title: string; description: string }
}

export function getAllPageSeoEntries(): Array<{ page: string; locale: string; title: string; description: string }> {
  const config = pageSeoJson as PageSeoConfig
  const entries: Array<{ page: string; locale: string; title: string; description: string }> = []

  for (const [page, locales] of Object.entries(config)) {
    for (const [locale, data] of Object.entries(locales)) {
      entries.push({
        page,
        locale,
        title: data.title,
        description: data.description,
      })
    }
  }

  return entries
}
