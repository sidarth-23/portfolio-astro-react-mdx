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
  | "externalResume"
  | "github"
  | "linkedin"
  | "rss"
  | "email"

export interface GlobalLink {
  id: GlobalLinkId
  title: string
  icon: GlobalLinkIcon
  href: (locale: Locale) => string
  isExternal: boolean
}

export type SidebarNavigationTitleKey = "nav.home" | "nav.blog" | "nav.profile"

export type SidebarNavigationIcon = "home" | "blog" | "profile"

export interface SidebarNavigationContentItem {
  titleKey: SidebarNavigationTitleKey
  path: (locale: Locale) => string
  icon: SidebarNavigationIcon
}

export interface SidebarProfileContent {
  name: string
  title: string
  avatar: string
  fallback: string
}

export type PageSeoKey = "home" | "blog" | "profile"

export interface PageSeoEntry {
  title: string
  description: string
}

export type PageSeoConfig = Record<PageSeoKey, Record<Locale, PageSeoEntry>>

export type ProfileSkillIconSource = "simple" | "huge" | "custom"

export interface ProfileSkillIcon {
  source: ProfileSkillIconSource
  name: string
}

export interface ProfileSkillItem {
  label: string
  icon: ProfileSkillIcon
}

export interface ProfileSkillGroup {
  title: string
  items: readonly ProfileSkillItem[]
}

export interface ProfileCertification {
  title: string
  url: string
}
