import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  FolderCodeIcon,
  BookOpen02Icon,
  File02Icon,
} from "@hugeicons/core-free-icons"
import { GitHubIcon, LinkedInIcon, RssIcon, MailIcon } from "@/components/icons"

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
  social: SocialLink[]
}

export function resolvePageTitle(
  currentPath: string,
  override?: string
): string {
  if (override) return override
  for (const item of sidebarContent.navigation) {
    if (item.url === currentPath) return item.title
  }
  return ""
}

export const sidebarContent: SidebarContent = {
  profile: {
    name: "Sidarth G",
    title: "Backend & Full-Stack Developer",
    avatar: "/avatar.jpg",
    fallback: "SG",
  },

  navigation: [
    {
      title: "Home",
      url: "/",
      icon: <HugeiconsIcon icon={Home01Icon} size={16} strokeWidth={2} />,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: <HugeiconsIcon icon={FolderCodeIcon} size={16} strokeWidth={2} />,
    },
    {
      title: "Blog",
      url: "/blog",
      icon: <HugeiconsIcon icon={BookOpen02Icon} size={16} strokeWidth={2} />,
    },
    {
      title: "Resume",
      url: "#",
      icon: <HugeiconsIcon icon={File02Icon} size={16} strokeWidth={2} />,
    },
  ],

  social: [
    {
      title: "GitHub",
      url: "https://github.com",
      icon: <GitHubIcon />,
    },
    {
      title: "LinkedIn",
      url: "https://linkedin.com",
      icon: <LinkedInIcon />,
    },
    {
      title: "RSS",
      url: "/rss.xml",
      icon: <RssIcon />,
    },
    {
      title: "Email",
      url: "mailto:hello@sidshub.in",
      icon: <MailIcon />,
    },
  ],
}
