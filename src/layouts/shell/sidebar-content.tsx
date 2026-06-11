import {
  Home01Icon,
  FolderCodeIcon,
  BookOpen02Icon,
  File02Icon,
  Archive02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { GitHubIcon, LinkedInIcon, RssIcon, MailIcon } from "@/components/icon"
import {
  getGlobalLink,
  sidebarNavigationContent,
  sidebarProfileContent,
} from "@/content/content"
import type { Locale } from "@/i18n/config"
import { t } from "@/i18n/ui"

import type { ReactNode } from "react"

export interface NavigationItem {
  title: string
  url: string
  icon: ReactNode
  isExternal: boolean
}

export interface SocialLink {
  title: string
  url: string
  icon: ReactNode
  isExternal: boolean
}

export interface ProfileInfo {
  name: string
  title: string
  avatar: string
  fallback: string
}

export interface SidebarContent {
  profile: ProfileInfo
  navigation: NavigationItem[]
  secondary: NavigationItem[]
  social: SocialLink[]
}

function navIcon(icon: "home" | "projects" | "blog" | "profile"): ReactNode {
  switch (icon) {
    case "home":
      return <HugeiconsIcon icon={Home01Icon} size={16} strokeWidth={2} />
    case "projects":
      return <HugeiconsIcon icon={FolderCodeIcon} size={16} strokeWidth={2} />
    case "blog":
      return <HugeiconsIcon icon={BookOpen02Icon} size={16} strokeWidth={2} />
    case "profile":
      return <HugeiconsIcon icon={File02Icon} size={16} strokeWidth={2} />
  }
}

function secondaryIcon(icon: "archive" | "externalResume"): ReactNode {
  switch (icon) {
    case "archive":
      return <HugeiconsIcon icon={Archive02Icon} size={16} strokeWidth={2} />
    case "externalResume":
      return <HugeiconsIcon icon={File02Icon} size={16} strokeWidth={2} />
  }
}

function socialIcon(icon: "github" | "linkedin" | "rss" | "email"): ReactNode {
  switch (icon) {
    case "github":
      return <GitHubIcon />
    case "linkedin":
      return <LinkedInIcon />
    case "rss":
      return <RssIcon />
    case "email":
      return <MailIcon />
  }
}

function buildNavigation(locale: Locale): NavigationItem[] {
  return sidebarNavigationContent.map((item) => ({
    title: t(locale, item.titleKey),
    url: item.path(locale),
    icon: navIcon(item.icon),
    isExternal: false,
  }))
}

function buildSecondary(locale: Locale): NavigationItem[] {
  return (
    [
      { id: "archive", title: t(locale, "nav.archive") },
      { id: "resume", title: t(locale, "nav.downloadResume") },
    ] as const
  ).map((item) => {
    const link = getGlobalLink(item.id)
    return {
      title: item.title,
      url: link.href(locale),
      icon: secondaryIcon(link.icon as "archive" | "externalResume"),
      isExternal: link.isExternal,
    }
  })
}

function buildSocial(locale: Locale): SocialLink[] {
  return (["github", "linkedin", "rss", "email"] as const).map((id) => {
    const link = getGlobalLink(id)
    return {
      title: link.title,
      url: link.href(locale),
      icon: socialIcon(link.icon as "github" | "linkedin" | "rss" | "email"),
      isExternal: link.isExternal,
    }
  })
}

export function resolvePageTitle(
  currentPath: string,
  locale: Locale = "en",
  override?: string
): string {
  if (override) return override

  return (
    buildNavigation(locale).find((item) => item.url === currentPath)?.title ??
    ""
  )
}

export function sidebarContent(locale: Locale = "en"): SidebarContent {
  return {
    profile: { ...sidebarProfileContent },
    navigation: buildNavigation(locale),
    secondary: buildSecondary(locale),
    social: buildSocial(locale),
  }
}
