import type { Locale } from "./config"
import {
  type TranslationSchema,
  type TranslationKey,
  validateTranslations,
} from "./schema"

const translations: Record<Locale, unknown> = {
  en: {
    nav: {
      home: "Home",
      projects: "Projects",
      blog: "Blog",
      resume: "Resume",
    },
    footer: {
      designedBy: "Designed by Sidarth",
    },
    blog: {
      title: "Blog",
      description: "Thoughts on engineering, design, and building things.",
      latest: "Latest Writing",
      viewAll: "View all posts \u2192",
    },
    projects: {
      title: "Projects",
      description:
        "A selection of things I have built, shipped, and learned from.",
      featured: "Featured Projects",
      viewAll: "View all projects \u2192",
      featuredLabel: "Featured",
    },
    lang: {
      aiGenerated: "AI Translated",
      selector: "Language",
    },
    meta: {
      description:
        "Sid's portfolio \u2014 thoughts on engineering, design, and building things.",
    },
    rss: {
      description: "Thoughts on engineering, design, and building things.",
    },
  },
  hi: {
    nav: {
      home: "\u0939\u094B\u092E",
      projects:
        "\u092A\u094D\u0930\u094B\u091C\u0947\u0915\u094D\u091F\u094D\u0938",
      blog: "\u092C\u094D\u0932\u0949\u0917",
      resume: "\u0930\u093F\u091C\u094D\u092F\u0942\u092E\u0947",
    },
    footer: {
      designedBy: "Designed by Sidarth",
    },
    blog: {
      title: "\u092C\u094D\u0932\u0949\u0917",
      description:
        "\u0907\u0902\u091C\u0940\u0928\u093F\u092F\u0930\u093F\u0902\u0917, \u0921\u093F\u095B\u093C\u093E\u0907\u0928, \u0914\u0930 \u091A\u0940\u095B\u093C\u0947\u0902 \u092C\u0928\u093E\u0928\u0947 \u092A\u0930 \u0935\u093F\u091A\u093E\u0930\u0964",
      latest: "\u0928\u0935\u0940\u0928\u0924\u092E \u0932\u0947\u0916",
      viewAll:
        "\u0938\u092D\u0940 \u092A\u094B\u0938\u094D\u091F \u0926\u0947\u0916\u0947\u0902 \u2192",
    },
    projects: {
      title:
        "\u092A\u094D\u0930\u094B\u091C\u0947\u0915\u094D\u091F\u094D\u0938",
      description:
        "\u091A\u0940\u095B\u093C\u0947\u0902 \u091C\u094B \u092E\u0948\u0902\u0928\u0947 \u092C\u0928\u093E\u0908, \u0936\u093F\u092A \u0915\u0940, \u0914\u0930 \u0938\u0940\u0916\u0940\u0964",
      featured:
        "\u092B\u0940\u091A\u0930\u094D\u0921 \u092A\u094D\u0930\u094B\u091C\u0947\u0915\u094D\u091F\u094D\u0938",
      viewAll:
        "\u0938\u092D\u0940 \u092A\u094D\u0930\u094B\u091C\u0947\u0915\u094D\u091F\u094D\u0938 \u0926\u0947\u0916\u0947\u0902 \u2192",
      featuredLabel: "\u092B\u0940\u091A\u0930\u094D\u0921",
    },
    lang: {
      aiGenerated:
        "AI \u0926\u094D\u0935\u093E\u0930\u093E \u0905\u0928\u0941\u0935\u093E\u0926\u093F\u0924",
      selector: "\u092D\u093E\u0937\u093E",
    },
    meta: {
      description:
        "\u0938\u093F\u0926 \u0915\u093E \u092A\u094B\u0930\u094D\u091F\u092B\u094B\u0932\u093F\u092F\u094B \u2014 \u0907\u0902\u091C\u0940\u0928\u093F\u092F\u0930\u093F\u0902\u0917, \u0921\u093F\u095B\u093C\u093E\u0907\u0928, \u0914\u0930 \u091A\u0940\u095B\u093C\u0947\u0902 \u092C\u0928\u093E\u0928\u0947 \u092A\u0930 \u0935\u093F\u091A\u093E\u0930\u0964",
    },
    rss: {
      description:
        "\u0907\u0902\u091C\u0940\u0928\u093F\u092F\u0930\u093F\u0902\u0917, \u0921\u093F\u095B\u093C\u093E\u0907\u0928, \u0914\u0930 \u091A\u0940\u095B\u093C\u0947\u0902 \u092C\u0928\u093E\u0928\u0947 \u092A\u0930 \u0935\u093F\u091A\u093E\u0930\u0964",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      projects: "Projets",
      blog: "Blog",
      resume: "CV",
    },
    footer: {
      designedBy: "Designed by Sidarth",
    },
    blog: {
      title: "Blog",
      description:
        "R\u00E9flexions sur l'ing\u00E9nierie, le design, et la construction de choses.",
      latest: "Derniers Articles",
      viewAll: "Voir tous les articles \u2192",
    },
    projects: {
      title: "Projets",
      description:
        "Une s\u00E9lection de choses que j'ai construites, livr\u00E9es et apprises.",
      featured: "Projets en Vedette",
      viewAll: "Voir tous les projets \u2192",
      featuredLabel: "En Vedette",
    },
    lang: {
      aiGenerated: "Traduit par IA",
      selector: "Langue",
    },
    meta: {
      description:
        "Portfolio de Sid \u2014 r\u00E9flexions sur l'ing\u00E9nierie, le design, et la construction de choses.",
    },
    rss: {
      description:
        "R\u00E9flexions sur l'ing\u00E9nierie, le design, et la construction de choses.",
    },
  },
}

/**
 * Validate every locale at module load in development.
 * This throws immediately if a locale is missing keys or has wrong types,
 * giving fast feedback before the build starts.
 */
if (import.meta.env?.DEV ?? true) {
  for (const [locale, data] of Object.entries(translations)) {
    validateTranslations(locale, data)
  }
}

/** Narrow the untyped record to typed after validation. */
const ui = translations as Record<Locale, TranslationSchema>

function getNestedValue(
  obj: TranslationSchema,
  path: string
): string | undefined {
  const parts = path.split(".")
  let current: unknown = obj
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }
  return typeof current === "string" ? current : undefined
}

/**
 * Get a translated string by dot-notation key.
 *
 * @param locale   Target locale
 * @param key      Dot-notation path (e.g. "nav.home"). Autocomplete works in
 *                 consumers because TranslationKey is derived from the schema.
 *
 * Falls back to English, then to the raw key.
 */
export function t(locale: Locale, key: TranslationKey): string {
  const value = getNestedValue(ui[locale], key)
  if (value !== undefined) return value

  const fallback = getNestedValue(ui.en, key)
  if (fallback !== undefined) return fallback

  return key
}
