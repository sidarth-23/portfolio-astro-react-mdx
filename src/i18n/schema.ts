import { z } from "zod"

export const TranslationSchema = z.object({
  nav: z.object({
    home: z.string(),
    projects: z.string(),
    blog: z.string(),
    cv: z.string(),
    archive: z.string(),
    downloadResume: z.string(),
  }),
  footer: z.object({
    designedBy: z.string(),
  }),
  blog: z.object({
    title: z.string(),
    description: z.string(),
    latest: z.string(),
    viewAll: z.string(),
    readMore: z.string(),
    published: z.string(),
    updated: z.string(),
    minRead: z.string(),
  }),
  projects: z.object({
    title: z.string(),
    description: z.string(),
    featured: z.string(),
    viewAll: z.string(),
    featuredLabel: z.string(),
    published: z.string(),
    updated: z.string(),
    minRead: z.string(),
  }),
  lang: z.object({
    aiGenerated: z.string(),
    selector: z.string(),
  }),
  meta: z.object({
    description: z.string(),
  }),
  rss: z.object({
    description: z.string(),
  }),
  hero: z.object({
    heading: z.string(),
    role: z.string(),
    description: z.string(),
    connect: z.string(),
    resume: z.string(),
    imageAlt: z.string(),
  }),
})

export type TranslationSchema = z.infer<typeof TranslationSchema>

/**
 * Derive a flat dot-notation key type from the nested schema.
 * E.g. "nav.home" | "footer.navigation" | ...
 */
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]]

type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
          ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
          : never
      }[keyof T]
    : ""

export type TranslationKey = Paths<TranslationSchema>

/**
 * Runtime validation: assert that a locale's translations conform to the schema.
 * Returns the validated object so TypeScript knows it's a TranslationSchema.
 */
export function validateTranslations(
  locale: string,
  data: unknown
): TranslationSchema {
  const result = TranslationSchema.safeParse(data)
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n")
    throw new Error(
      `Translation validation failed for locale "${locale}":\n${issues}`
    )
  }
  return result.data
}
