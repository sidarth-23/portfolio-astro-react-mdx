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
    search: {
      open: "Search",
      title: "Search the site",
      description: "Search posts, profile details, and section-level content.",
      placeholder: "Search posts, profile, sections...",
      minChars: "Type at least 2 characters",
      loading: "Searching...",
      error: "Search failed. Try again.",
      empty: "No results found",
      groupBlog: "Blog posts",
      groupProfile: "Profile",
      kindPage: "Page",
      kindSection: "Section",
      kindItem: "Item",
      hintNavigate: "navigate",
      hintOpen: "open",
      hintClose: "close",
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
      role: "Software Developer",
      description:
        "Professional bug writer and occasional feature shipper. I speak React, Next.js, Node.js, and Go — sometimes all in the same project. Currently exploring TanStack Start because one framework is never enough. Yes, I still Google 'how to exit vim'. Always curious, always learning.",
      connect: "Let's Connect",
      resume: "View Profile",
      imageAlt: "Sidarth G — Software Developer",
    },
    toc: {
      onThisPage: "On this page",
    },
  },
  es: {
    nav: {
      home: "Inicio",
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
    search: {
      open: "Buscar",
      title: "Buscar en el sitio",
      description:
        "Busca publicaciones, detalles del perfil y contenido por secciones.",
      placeholder: "Buscar publicaciones, perfil, secciones...",
      minChars: "Escribe al menos 2 caracteres",
      loading: "Buscando...",
      error: "Error en la búsqueda. Inténtalo de nuevo.",
      empty: "No se encontraron resultados",
      groupBlog: "Publicaciones del blog",
      groupProfile: "Perfil",
      kindPage: "Página",
      kindSection: "Sección",
      kindItem: "Elemento",
      hintNavigate: "navegar",
      hintOpen: "abrir",
      hintClose: "cerrar",
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
      role: "Desarrollador de Software",
      description:
        "Escritor profesional de bugs y enviador ocasional de features. Hablo React, Next.js, Node.js y Go — a veces todos en el mismo proyecto. Actualmente explorando TanStack Start porque un framework nunca es suficiente. Sí, todavía busco 'cómo salir de vim'. Siempre curioso, siempre aprendiendo.",
      connect: "Conectemos",
      resume: "Ver Perfil",
      imageAlt: "Sidarth G — Desarrollador de Software",
    },
    toc: {
      onThisPage: "En esta página",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      blog: "Blog",
      profile: "Profil",
      archive: "Site Archive",
      downloadResume: "Profil",
    },
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
    search: {
      open: "Rechercher",
      title: "Rechercher sur le site",
      description:
        "Recherchez des articles, des détails du profil et du contenu par section.",
      placeholder: "Rechercher articles, profil, sections...",
      minChars: "Saisissez au moins 2 caractères",
      loading: "Recherche...",
      error: "Échec de la recherche. Réessayez.",
      empty: "Aucun résultat trouvé",
      groupBlog: "Articles du blog",
      groupProfile: "Profil",
      kindPage: "Page",
      kindSection: "Section",
      kindItem: "Élément",
      hintNavigate: "naviguer",
      hintOpen: "ouvrir",
      hintClose: "fermer",
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
      role: "Développeur Logiciel",
      description:
        "Rédacteur professionnel de bugs et expéditeur occasionnel de features. Je parle React, Next.js, Node.js et Go — parfois tous dans le même projet. J'explore actuellement TanStack Start parce qu'un framework ne suffit jamais. Oui, je Google toujours 'comment quitter vim'. Toujours curieux, toujours en train d'apprendre.",
      connect: "Me Contacter",
      resume: "Voir le Profil",
      imageAlt: "Sidarth G — Développeur Logiciel",
    },
    toc: {
      onThisPage: "Sur cette page",
    },
  },
}

/**
 * Validate every locale at module load in development.
 * This throws immediately if a locale is missing keys or has wrong types,
 * giving fast feedback before the build starts.
 */
if (import.meta.env.DEV) {
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
