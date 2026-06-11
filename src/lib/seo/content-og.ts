export function slugToOgToken(slug: string): string {
  return slug
    .replace(/\//g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function buildContentOgFilename(
  type: "blog",
  locale: string,
  slug: string
): string {
  return `og-${type}-${locale}-${slugToOgToken(slug)}.png`
}
