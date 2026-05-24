import type { Locale } from "@/i18n/config"

export interface SidebarNavigationContentItem {
  titleKey: "nav.home" | "nav.projects" | "nav.blog" | "nav.profile"
  path: (locale: Locale) => string
  icon: "home" | "projects" | "blog" | "profile"
}

export const sidebarProfileContent = {
  name: "Sidarth G",
  title: "Software Developer",
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
    titleKey: "nav.profile",
    path: (locale) => `/${locale}/profile`,
    icon: "profile",
  },
]
