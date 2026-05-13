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
      home: "होम",
      projects: "प्रोजेक्ट्स",
      blog: "ब्लॉग",
      resume: "रिज्यूमे",
    },
    footer: {
      designedBy: "Designed by Sidarth",
    },
    blog: {
      title: "ब्लॉग",
      description:
        "इंजीनियरिंग, डिज़़ाइन, और चीज़़ें बनाने पर विचार।",
      latest: "नवीनतम लेख",
      viewAll: "सभी पोस्ट देखें →",
    },
    projects: {
      title: "प्रोजेक्ट्स",
      description:
        "चीज़़ें जो मैंने बनाई, शिप की, और सीखी।",
      featured: "फीचर्ड प्रोजेक्ट्स",
      viewAll: "सभी प्रोजेक्ट्स देखें →",
      featuredLabel: "फीचर्ड",
    },
    lang: {
      aiGenerated: "AI द्वारा अनुवादित",
      selector: "भाषा",
    },
    meta: {
      description:
        "सिद का पोर्टफोलियो — इंजीनियरिंग, डिज़़ाइन, और चीज़़ें बनाने पर विचार।",
    },
    rss: {
      description:
        "इंजीनियरिंग, डिज़़ाइन, और चीज़़ें बनाने पर विचार।",
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
