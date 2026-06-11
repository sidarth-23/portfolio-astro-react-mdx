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

export type SidebarNavigationTitleKey =
  | "nav.home"
  | "nav.projects"
  | "nav.blog"
  | "nav.profile"

export type SidebarNavigationIcon = "home" | "projects" | "blog" | "profile"

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

export type PageSeoKey = "home" | "blog" | "projects" | "profile"

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

export interface ProfileLocaleContent<L extends Locale = Locale> {
  locale: L
  profile: {
    name: string
    role: string
    summary: string
    focus: readonly [string, ...string[]]
  }
  skills: readonly ProfileSkillGroup[]
  certifications: readonly ProfileCertification[]
}

export type ProfileContentByLocale = {
  [L in Locale]: ProfileLocaleContent<L>
}
