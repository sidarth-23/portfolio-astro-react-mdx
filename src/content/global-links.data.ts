import type { Locale } from "@/i18n/config"

export type GlobalLinkId =
  | "archive"
  | "resume"
  | "github"
  | "linkedin"
  | "rss"
  | "email"

export type GlobalLinkIcon =
  | "archive"
  | "downloadResume"
  | "github"
  | "linkedin"
  | "rss"
  | "email"

export interface GlobalLink {
  id: GlobalLinkId
  title: string
  icon: GlobalLinkIcon
  href: (locale: Locale) => string
}

export const globalLinks: GlobalLink[] = [
  {
    id: "archive",
    title: "Archive",
    icon: "archive",
    href: () => "https://archive-portfolio.sidshub.in",
  },
  {
    id: "resume",
    title: "Resume",
    icon: "downloadResume",
    href: () => "/resume",
  },
  {
    id: "github",
    title: "GitHub",
    icon: "github",
    href: () => "https://github.com/sidarth-23",
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    icon: "linkedin",
    href: () => "https://linkedin.com/in/sidarth-g",
  },
  {
    id: "rss",
    title: "RSS",
    icon: "rss",
    href: (locale) => `/${locale}/rss.xml`,
  },
  {
    id: "email",
    title: "Email",
    icon: "email",
    href: () => "mailto:g.sidarth23@gmail.com",
  },
]

export const homeCtaLinkIds = {
  primary: "linkedin",
  secondary: "resume",
} as const

export function getGlobalLink(id: GlobalLinkId): GlobalLink {
  const link = globalLinks.find((item) => item.id === id)
  if (!link) {
    throw new Error(`Unknown global link id: ${id}`)
  }
  return link
}
