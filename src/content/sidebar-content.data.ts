import type { Locale } from "@/i18n/config"

export interface SidebarNavigationContentItem {
  titleKey: "nav.home" | "nav.projects" | "nav.blog" | "nav.cv"
  path: (locale: Locale) => string
  icon: "home" | "projects" | "blog" | "cv"
}

export interface SidebarSecondaryContentItem {
  titleKey: "nav.archive" | "nav.downloadResume"
  url: string
  icon: "archive" | "downloadResume"
}

export interface SidebarSocialContentItem {
  title: "GitHub" | "LinkedIn" | "RSS" | "Email"
  url: (locale: Locale) => string
  icon: "github" | "linkedin" | "rss" | "email"
}

export const sidebarProfileContent = {
  name: "Sidarth G",
  title: "Backend & Full-Stack Developer",
  avatar: "/avatar.jpg",
  fallback: "SG",
} as const

export const sidebarNavigationContent: SidebarNavigationContentItem[] = [
  {
    titleKey: "nav.home",
    path: (locale) => `/${locale}`,
    icon: "home",
  },
  {
    titleKey: "nav.projects",
    path: (locale) => `/${locale}/projects`,
    icon: "projects",
  },
  {
    titleKey: "nav.blog",
    path: (locale) => `/${locale}/blog`,
    icon: "blog",
  },
  {
    titleKey: "nav.cv",
    path: (locale) => `/${locale}/cv`,
    icon: "cv",
  },
]

export const sidebarSecondaryContent: SidebarSecondaryContentItem[] = [
  {
    titleKey: "nav.archive",
    url: "https://archive-portfolio.sidshub.in",
    icon: "archive",
  },
  {
    titleKey: "nav.downloadResume",
    url: "https://docs.google.com/document/d/11b-14LpVAj4N0t2oE48UKhVarS09YzWW/edit?usp=sharing&ouid=108256755841823437144&rtpof=true&sd=true",
    icon: "downloadResume",
  },
]

export const sidebarSocialContent: SidebarSocialContentItem[] = [
  {
    title: "GitHub",
    url: () => "https://github.com/sidarth-23",
    icon: "github",
  },
  {
    title: "LinkedIn",
    url: () => "https://linkedin.com/in/sidarth-g",
    icon: "linkedin",
  },
  {
    title: "RSS",
    url: (locale) => `/${locale}/rss.xml`,
    icon: "rss",
  },
  {
    title: "Email",
    url: () => "mailto:g.sidarth23@gmail.com",
    icon: "email",
  },
]
