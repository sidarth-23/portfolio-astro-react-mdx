import type {
  GlobalLink,
  GlobalLinkId,
  PageSeoConfig,
  SidebarNavigationContentItem,
  SidebarProfileContent,
} from "./content.types"

export const RESUME_EXTERNAL_URL =
  "https://docs.google.com/document/d/1Px7U82adaL04Ylcn3NQvDTSRUqXh3PAxydJPMch0oqU/edit?usp=sharing"

export const globalLinks = [
  {
    id: "archive",
    title: "Archive",
    icon: "archive",
    href: () => "https://archive-portfolio.sidshub.in",
    isExternal: true,
  },
  {
    id: "resume",
    title: "Resume",
    icon: "externalResume",
    href: () => RESUME_EXTERNAL_URL,
    isExternal: true,
  },
  {
    id: "github",
    title: "GitHub",
    icon: "github",
    href: () => "https://github.com/sidarth-23",
    isExternal: true,
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    icon: "linkedin",
    href: () => "https://linkedin.com/in/sidarth-g",
    isExternal: true,
  },
  {
    id: "rss",
    title: "RSS",
    icon: "rss",
    href: (locale) => `/${locale}/rss.xml`,
    isExternal: false,
  },
  {
    id: "email",
    title: "Email",
    icon: "email",
    href: () => "mailto:g.sidarth23@gmail.com",
    isExternal: true,
  },
] as const satisfies readonly GlobalLink[]

export const homeCtaLinkIds = {
  primary: "linkedin",
  secondary: "resume",
} as const satisfies { primary: GlobalLinkId; secondary: GlobalLinkId }

export function getGlobalLink(id: GlobalLinkId): GlobalLink {
  const link = globalLinks.find((item) => item.id === id)
  if (!link) {
    throw new Error(`Unknown global link id: ${id}`)
  }
  return link
}

export const sidebarProfileContent = {
  name: "Sidarth G",
  title: "Software Developer",
  avatar: "/avatar.jpg",
  fallback: "SG",
} as const satisfies SidebarProfileContent

export const sidebarNavigationContent = [
  {
    titleKey: "nav.home",
    path: (locale) => `/${locale}`,
    icon: "home",
  },
  {
    titleKey: "nav.blog",
    path: (locale) => `/${locale}/blog`,
    icon: "blog",
  },
  {
    titleKey: "nav.profile",
    path: (locale) => `/${locale}/profile`,
    icon: "profile",
  },
] as const satisfies readonly SidebarNavigationContentItem[]

export const pageSeo = {
  home: {
    en: {
      title: "Sidarth G | Software Developer Portfolio, Blog & Projects",
      description:
        "Explore Sidarth G's portfolio, blog, projects, and experiments across software engineering, product thinking, and the occasional side quest.",
    },
    es: {
      title: "Sidarth G | Portafolio de desarrollo, blog y proyectos",
      description:
        "Explora el portafolio, blog, proyectos y experimentos de Sidarth G sobre ingeniería de software, producto y alguna que otra aventura extra.",
    },
    fr: {
      title: "Sidarth G | Portfolio développeur, blog et projets",
      description:
        "Découvrez le portfolio, le blog, les projets et les expériences de Sidarth G autour du développement, du produit et de quelques détours.",
    },
  },
  blog: {
    en: {
      title: "Engineering blog, notes, and project deep dives",
      description:
        "Read concise notes and deeper posts on software engineering, shipping products, and working with React, Astro, Go, and modern tooling.",
    },
    es: {
      title: "Blog de ingeniería, notas y análisis de proyectos",
      description:
        "Lee notas breves y artículos sobre ingeniería de software, lanzamiento de productos y trabajo con React, Astro, Go y herramientas modernas.",
    },
    fr: {
      title: "Blog d'ingénierie, notes et analyses de projets",
      description:
        "Lisez des notes courtes et des articles sur le développement logiciel, la mise en ligne de produits et l'usage de React, Astro, Go et d'outils modernes.",
    },
  },
  profile: {
    en: {
      title: "Profile, skills, experience, and certifications",
      description:
        "See Sidarth G's profile, skills, experience, certifications, and a compact summary of how he builds software and keeps learning.",
    },
    es: {
      title: "Perfil, habilidades, experiencia y certificaciones",
      description:
        "Consulta el perfil, habilidades, experiencia, certificaciones y un resumen breve de cómo Sidarth G construye software y sigue aprendiendo.",
    },
    fr: {
      title: "Profil, compétences, expérience et certifications",
      description:
        "Découvrez le profil, les compétences, l'expérience, les certifications et un résumé concis de la façon dont Sidarth G construit du logiciel.",
    },
  },
} as const satisfies PageSeoConfig
