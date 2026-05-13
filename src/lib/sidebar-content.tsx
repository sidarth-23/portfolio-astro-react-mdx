import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  FolderCodeIcon,
  BookOpen02Icon,
  File02Icon,
  Linkedin01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"
import { siGithub, siRss } from "simple-icons"
import { SimpleIcon } from "@/components/shared/simple-icon"

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
      icon: <HugeiconsIcon icon={Home01Icon} strokeWidth={2} />,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: <HugeiconsIcon icon={FolderCodeIcon} strokeWidth={2} />,
    },
    {
      title: "Blog",
      url: "/blog",
      icon: <HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />,
    },
    {
      title: "Resume",
      url: "#",
      icon: <HugeiconsIcon icon={File02Icon} strokeWidth={2} />,
    },
  ],

  social: [
    {
      title: "GitHub",
      url: "https://github.com",
      icon: <SimpleIcon icon={siGithub} />,
    },
    {
      title: "LinkedIn",
      url: "https://linkedin.com",
      icon: <HugeiconsIcon icon={Linkedin01Icon} strokeWidth={2} />,
    },
    {
      title: "RSS",
      url: "/rss.xml",
      icon: <SimpleIcon icon={siRss} />,
    },
    {
      title: "Email",
      url: "mailto:hello@sidshub.in",
      icon: <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />,
    },
  ],
}
