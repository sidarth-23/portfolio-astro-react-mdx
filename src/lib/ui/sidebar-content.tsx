import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  FolderCodeIcon,
  BookOpen02Icon,
  File02Icon,
  Archive02Icon,
  Download02Icon,
} from "@hugeicons/core-free-icons"
import { GitHubIcon, LinkedInIcon, RssIcon, MailIcon } from "@/components/icon"
import type { Locale } from "@/i18n/config"
import { t } from "@/i18n/ui"
import {
  sidebarNavigationContent,
  sidebarProfileContent,
  sidebarSecondaryContent,
  sidebarSocialContent,
} from "@/content/sidebar-content.data"

export interface NavigationItem {
  title: string
  url: string
  icon: ReactNode
}

export interface SocialLink {
  title: string
  url: string
  icon: ReactNode
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

function navIcon(icon: "home" | "projects" | "blog" | "cv"): ReactNode {
  switch (icon) {
    case "home":
      return <HugeiconsIcon icon={Home01Icon} size={16} strokeWidth={2} />
    case "projects":
      return <HugeiconsIcon icon={FolderCodeIcon} size={16} strokeWidth={2} />
    case "blog":
      return <HugeiconsIcon icon={BookOpen02Icon} size={16} strokeWidth={2} />
    case "cv":
      return <HugeiconsIcon icon={File02Icon} size={16} strokeWidth={2} />
  }
}

function secondaryIcon(icon: "archive" | "downloadResume"): ReactNode {
  switch (icon) {
    case "archive":
      return <HugeiconsIcon icon={Archive02Icon} size={16} strokeWidth={2} />
    case "downloadResume":
      return <HugeiconsIcon icon={Download02Icon} size={16} strokeWidth={2} />
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
  }))
}

function buildSecondary(locale: Locale): NavigationItem[] {
  return sidebarSecondaryContent.map((item) => ({
    title: t(locale, item.titleKey),
    url: item.url,
    icon: secondaryIcon(item.icon),
  }))
}

function buildSocial(locale: Locale): SocialLink[] {
  return sidebarSocialContent.map((item) => ({
    title: item.title,
    url: item.url(locale),
    icon: socialIcon(item.icon),
  }))
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
