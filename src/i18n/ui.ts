import type { Locale } from "@/i18n/config"
import {
  type TranslationSchema,
  type TranslationKey,
  validateTranslations,
} from "@/i18n/schema"

const translations: Record<Locale, TranslationSchema> = {
  en: {
    nav: {
      home: "Home",
      projects: "Projects",
      blog: "Blog",
      profile: "Profile",
      archive: "Archive Site",
      downloadResume: "Resume",
    },
    footer: {
      designedBy: "Designed by Sidarth",
    },
    blog: {
      title: "Blog",
      description: "Thoughts on engineering, design, and building things.",
      latest: "Latest Writing",
      viewAll: "View all posts →",
      readMore: "Read more",
      published: "Published",
      updated: "Updated",
      minRead: "min read",
    },
    projects: {
      title: "Projects",
      description:
        "A selection of things I have built, shipped, and learned from.",
      featured: "Featured Projects",
      viewAll: "View all projects →",
      featuredLabel: "Featured",
      published: "Published",
      updated: "Updated",
      minRead: "min read",
    },
    filters: {
      searchPlaceholder: "Search...",
      clearFilters: "Clear filters",
      noResults: "No results found",
      loading: "Loading...",
      loadMore: "Load more",
      title: "Filters",
      sortBy: "Sort by",
      newest: "Newest",
      oldest: "Oldest",
      titleAZ: "Title A-Z",
      tags: "Tags",
      categories: "Categories",
      apply: "Apply",
    },
    lang: {
      aiGenerated: "AI Translated",
      selector: "Language",
    },
    meta: {
      description:
        "Sid's portfolio — thoughts on engineering, design, and building things.",
    },
    rss: {
      description: "Thoughts on engineering, design, and building things.",
    },
    hero: {
      heading: "Sidarth G",
      role: "Backend & Full-Stack Developer",
      description:
        "I build fast, reliable products with modern web tech and cloud infrastructure. Turning complex problems into elegant solutions — from robust APIs to seamless user experiences. Always learning, always shipping.",
      connect: "Let's Connect",
      resume: "View Profile",
      imageAlt: "Sidarth G — Backend & Full-Stack Developer",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      projects: "Proyectos",
      blog: "Blog",
      profile: "Perfil",
      archive: "Sitio Archivo",
      downloadResume: "Currículum",
    },
    footer: {
      designedBy: "Designed by Sidarth",
    },
    blog: {
      title: "Blog",
      description:
        "Reflexiones sobre ingeniería, diseño y construcción de cosas.",
      latest: "Últimas Publicaciones",
      viewAll: "Ver todas las publicaciones →",
      readMore: "Leer más",
      published: "Publicado",
      updated: "Actualizado",
      minRead: "min de lectura",
    },
    projects: {
      title: "Proyectos",
      description:
        "Una selección de cosas que he construido, enviado y aprendido.",
      featured: "Proyectos Destacados",
      viewAll: "Ver todos los proyectos →",
      featuredLabel: "Destacado",
      published: "Publicado",
      updated: "Actualizado",
      minRead: "min de lectura",
    },
    filters: {
      searchPlaceholder: "Buscar...",
      clearFilters: "Limpiar filtros",
      noResults: "No se encontraron resultados",
      loading: "Cargando...",
      loadMore: "Cargar más",
      title: "Filtros",
      sortBy: "Ordenar por",
      newest: "Más reciente",
      oldest: "Más antiguo",
      titleAZ: "Título A-Z",
      tags: "Etiquetas",
      categories: "Categorías",
      apply: "Aplicar",
    },
    lang: {
      aiGenerated: "Traducido por IA",
      selector: "Idioma",
    },
    meta: {
      description:
        "Portafolio de Sid — reflexiones sobre ingeniería, diseño y construcción de cosas.",
    },
    rss: {
      description:
        "Reflexiones sobre ingeniería, diseño y construcción de cosas.",
    },
    hero: {
      heading: "Sidarth G",
      role: "Desarrollador Backend y Full-Stack",
      description:
        "Construyo productos rápidos y confiables con tecnologías web modernas e infraestructura en la nube. Transformo problemas complejos en soluciones elegantes — desde API robustas hasta experiencias de usuario fluidas. Siempre aprendiendo, siempre enviando.",
      connect: "Conectemos",
      resume: "Ver Perfil",
      imageAlt: "Sidarth G — Desarrollador Backend y Full-Stack",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      projects: "Projets",
      blog: "Blog",
      profile: "Profil",
      archive: "Site Archive",
      downloadResume: "Profil",    },
    footer: {
      designedBy: "Designed by Sidarth",
    },
    blog: {
      title: "Blog",
      description:
        "Réflexions sur l'ingénierie, le design, et la construction de choses.",
      latest: "Derniers Articles",
      viewAll: "Voir tous les articles →",
      readMore: "Lire la suite",
      published: "Publié",
      updated: "Mis à jour",
      minRead: "min de lecture",
    },
    projects: {
      title: "Projets",
      description:
        "Une sélection de choses que j'ai construites, livrées et apprises.",
      featured: "Projets en Vedette",
      viewAll: "Voir tous les projets →",
      featuredLabel: "En Vedette",
      published: "Publié",
      updated: "Mis à jour",
      minRead: "min de lecture",
    },
    filters: {
      searchPlaceholder: "Rechercher...",
      clearFilters: "Effacer les filtres",
      noResults: "Aucun résultat trouvé",
      loading: "Chargement...",
      loadMore: "Charger plus",
      title: "Filtres",
      sortBy: "Trier par",
      newest: "Plus récent",
      oldest: "Plus ancien",
      titleAZ: "Titre A-Z",
      tags: "Tags",
      categories: "Catégories",
      apply: "Appliquer",
    },
    lang: {
      aiGenerated: "Traduit par IA",
      selector: "Langue",
    },
    meta: {
      description:
        "Portfolio de Sid — réflexions sur l'ingénierie, le design, et la construction de choses.",
    },
    rss: {
      description:
        "Réflexions sur l'ingénierie, le design, et la construction de choses.",
    },
    hero: {
      heading: "Sidarth G",
      role: "Développeur Backend & Full-Stack",
      description:
        "Je construis des produits rapides et fiables avec des technologies web modernes et une infrastructure cloud. Transformer des problèmes complexes en solutions élégantes — des API robustes aux expériences utilisateur fluides. Toujours en apprentissage, toujours en production.",
      connect: "Me Contacter",
      resume: "Voir le Profil",      imageAlt: "Sidarth G — Développeur Backend & Full-Stack",
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

const ui = translations

type TranslationNode = string | { [key: string]: TranslationNode }

function getNestedValue(
  obj: TranslationSchema,
  path: string
): string | undefined {
  const parts = path.split(".")
  let current: TranslationNode = obj as TranslationNode
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part]
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
