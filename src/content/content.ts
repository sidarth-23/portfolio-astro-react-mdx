import type {
  GlobalLink,
  GlobalLinkId,
  PageSeoConfig,
  ProfileContentByLocale,
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

export const profileContent = {
  en: {
    locale: "en",
    profile: {
      name: "Sidarth G",
      role: "Software Developer",
      summary:
        "I write code that sometimes works on the first try. Started with HTML because I wanted to make cool websites, fell deep into the React rabbit hole, then discovered backend development and somehow ended up writing Go. I get unreasonably excited about new JavaScript frameworks (currently exploring TanStack Start) and still Google 'how to center a div' just to feel something. Always learning, always breaking things, always wondering why it works on my machine.",
      focus: ["React & Next.js", "Node.js & Go", "Always Learning"],
    },
    skills: [
      {
        title: "Backend & Systems",
        items: [
          { label: "Golang", icon: { source: "simple", name: "go" } },
          { label: "Python", icon: { source: "simple", name: "python" } },
          { label: "Node.js", icon: { source: "simple", name: "nodedotjs" } },
          { label: "Hono", icon: { source: "custom", name: "hono" } },
          { label: "Elysia", icon: { source: "custom", name: "elysia" } },
          { label: "gRPC", icon: { source: "custom", name: "grpc" } },
          { label: "WebSockets", icon: { source: "huge", name: "cloud" } },
        ],
      },
      {
        title: "Database & Auth",
        items: [
          {
            label: "PostgreSQL",
            icon: { source: "simple", name: "postgresql" },
          },
          { label: "SQL", icon: { source: "huge", name: "database" } },
          {
            label: "Turso (SQLite)",
            icon: { source: "simple", name: "turso" },
          },
          { label: "Drizzle", icon: { source: "custom", name: "drizzle" } },
          { label: "GORM", icon: { source: "custom", name: "gorm" } },
        ],
      },
      {
        title: "Frontend & DX",
        items: [
          { label: "React", icon: { source: "simple", name: "react" } },
          { label: "Next.js", icon: { source: "simple", name: "nextjs" } },
          {
            label: "TanStack Start",
            icon: { source: "simple", name: "tanstack" },
          },
          { label: "Astro", icon: { source: "simple", name: "astro" } },
          {
            label: "TypeScript",
            icon: { source: "simple", name: "typescript" },
          },
          {
            label: "Tailwind CSS",
            icon: { source: "simple", name: "tailwindcss" },
          },
        ],
      },
    ],
    certifications: [
      {
        title: "Learn Go",
        url: "https://www.boot.dev/certificate/lostboot50/3b39d0f6-f944-4f1b-832d-a1daba32eda4",
      },
      {
        title: "CS50's Introduction to Computer Science",
        url: "https://certificates.cs50.io/bf85e0a3-fe88-4281-badc-948d55a269d1.pdf",
      },
      {
        title: "Google Project Management: Professional Certificate",
        url: "https://www.coursera.org/account/accomplishments/specialization/certificate/PAEF3VXVBNB4",
      },
      {
        title: "IBM Full Stack Software Developer Professional Certificate",
        url: "https://www.coursera.org/account/accomplishments/specialization/certificate/NLAT8P4VQJS9",
      },
    ],
  },
  es: {
    locale: "es",
    profile: {
      name: "Sidarth G",
      role: "Desarrollador de Software",
      summary:
        "Escribo código que a veces funciona a la primera. Empecé con HTML porque quería hacer sitios web geniales, me metí de lleno en el mundo de React, luego descubrí el backend y de alguna manera terminé escribiendo Go. Me emociono demasiado con nuevos frameworks de JavaScript (actualmente explorando TanStack Start) y todavía busco 'cómo centrar un div' solo para sentir algo. Siempre aprendiendo, siempre rompiendo cosas, siempre preguntándome por qué funciona en mi máquina.",
      focus: ["React y Next.js", "Node.js y Go", "Siempre Aprendiendo"],
    },
    skills: [
      {
        title: "Backend y Sistemas",
        items: [
          { label: "Golang", icon: { source: "simple", name: "go" } },
          { label: "Python", icon: { source: "simple", name: "python" } },
          { label: "Node.js", icon: { source: "simple", name: "nodedotjs" } },
          { label: "Hono", icon: { source: "custom", name: "hono" } },
          { label: "Elysia", icon: { source: "custom", name: "elysia" } },
          { label: "gRPC", icon: { source: "custom", name: "grpc" } },
          { label: "WebSockets", icon: { source: "huge", name: "cloud" } },
        ],
      },
      {
        title: "Base de datos y Autenticación",
        items: [
          {
            label: "PostgreSQL",
            icon: { source: "simple", name: "postgresql" },
          },
          { label: "SQL", icon: { source: "huge", name: "database" } },
          {
            label: "Turso (SQLite)",
            icon: { source: "simple", name: "turso" },
          },
          { label: "Drizzle", icon: { source: "custom", name: "drizzle" } },
          { label: "GORM", icon: { source: "custom", name: "gorm" } },
        ],
      },
      {
        title: "Frontend y DX",
        items: [
          { label: "React", icon: { source: "simple", name: "react" } },
          { label: "Next.js", icon: { source: "simple", name: "nextjs" } },
          {
            label: "TanStack Start",
            icon: { source: "simple", name: "tanstack" },
          },
          { label: "Astro", icon: { source: "simple", name: "astro" } },
          {
            label: "TypeScript",
            icon: { source: "simple", name: "typescript" },
          },
          {
            label: "Tailwind CSS",
            icon: { source: "simple", name: "tailwindcss" },
          },
        ],
      },
    ],
    certifications: [
      {
        title: "Learn Go",
        url: "https://www.boot.dev/certificate/lostboot50/3b39d0f6-f944-4f1b-832d-a1daba32eda4",
      },
      {
        title: "CS50's Introduction to Computer Science",
        url: "https://certificates.cs50.io/bf85e0a3-fe88-4281-badc-948d55a269d1.pdf",
      },
      {
        title: "Google Project Management: Professional Certificate",
        url: "https://www.coursera.org/account/accomplishments/specialization/certificate/PAEF3VXVBNB4",
      },
      {
        title: "IBM Full Stack Software Developer Professional Certificate",
        url: "https://www.coursera.org/account/accomplishments/specialization/certificate/NLAT8P4VQJS9",
      },
    ],
  },
  fr: {
    locale: "fr",
    profile: {
      name: "Sidarth G",
      role: "Développeur Logiciel",
      summary:
        "J'écris du code qui fonctionne parfois du premier coup. J'ai commencé avec HTML parce que je voulais créer des sites web cool, je suis tombé dans le terrier du lapin React, puis j'ai découvert le backend et j'ai fini par écrire du Go. Je m'enthousiasme déraisonnablement pour les nouveaux frameworks JavaScript (j'explore actuellement TanStack Start) et je Google toujours 'comment centrer un div' juste pour ressentir quelque chose. Toujours en train d'apprendre, toujours en train de casser des choses, toujours en me demandant pourquoi ça fonctionne sur ma machine.",
      focus: ["React & Next.js", "Node.js & Go", "Toujours en Apprentissage"],
    },
    skills: [
      {
        title: "Backend & Systèmes",
        items: [
          { label: "Golang", icon: { source: "simple", name: "go" } },
          { label: "Python", icon: { source: "simple", name: "python" } },
          { label: "Node.js", icon: { source: "simple", name: "nodedotjs" } },
          { label: "Hono", icon: { source: "custom", name: "hono" } },
          { label: "Elysia", icon: { source: "custom", name: "elysia" } },
          { label: "gRPC", icon: { source: "custom", name: "grpc" } },
          { label: "WebSockets", icon: { source: "huge", name: "cloud" } },
        ],
      },
      {
        title: "Base de données & Auth",
        items: [
          {
            label: "PostgreSQL",
            icon: { source: "simple", name: "postgresql" },
          },
          { label: "SQL", icon: { source: "huge", name: "database" } },
          {
            label: "Turso (SQLite)",
            icon: { source: "simple", name: "turso" },
          },
          { label: "Drizzle", icon: { source: "custom", name: "drizzle" } },
          { label: "GORM", icon: { source: "custom", name: "gorm" } },
        ],
      },
      {
        title: "Frontend & DX",
        items: [
          { label: "React", icon: { source: "simple", name: "react" } },
          { label: "Next.js", icon: { source: "simple", name: "nextjs" } },
          {
            label: "TanStack Start",
            icon: { source: "simple", name: "tanstack" },
          },
          { label: "Astro", icon: { source: "simple", name: "astro" } },
          {
            label: "TypeScript",
            icon: { source: "simple", name: "typescript" },
          },
          {
            label: "Tailwind CSS",
            icon: { source: "simple", name: "tailwindcss" },
          },
        ],
      },
    ],
    certifications: [
      {
        title: "Learn Go",
        url: "https://www.boot.dev/certificate/lostboot50/3b39d0f6-f944-4f1b-832d-a1daba32eda4",
      },
      {
        title: "CS50's Introduction to Computer Science",
        url: "https://certificates.cs50.io/bf85e0a3-fe88-4281-badc-948d55a269d1.pdf",
      },
      {
        title: "Google Project Management: Professional Certificate",
        url: "https://www.coursera.org/account/accomplishments/specialization/certificate/PAEF3VXVBNB4",
      },
      {
        title: "IBM Full Stack Software Developer Professional Certificate",
        url: "https://www.coursera.org/account/accomplishments/specialization/certificate/NLAT8P4VQJS9",
      },
    ],
  },
} as const satisfies ProfileContentByLocale
