/**
 * Sidebar content configuration
 * Easily replaceable data for the portfolio sidebar
 */

/** Navigation link item for sidebar menu */
export interface NavigationItem {
  /** Display title of the navigation link */
  title: string
  /** URL or route path */
  url: string
  /** Icon identifier from icon library */
  icon: string
}

/** Social media link item */
export interface SocialLink {
  /** Platform or service name */
  title: string
  /** Full URL to the profile or resource */
  url: string
  /** Icon identifier for the platform */
  icon: string
}

/** Profile information displayed in sidebar */
export interface ProfileInfo {
  /** Full name displayed in sidebar */
  name: string
  /** Professional title or role */
  title: string
  /** Path to avatar image */
  avatar: string
  /** Fallback initials when avatar fails to load */
  fallback: string
}

/** Complete sidebar content structure */
export interface SidebarContent {
  /** Profile section configuration */
  profile: ProfileInfo
  /** Main navigation links */
  navigation: NavigationItem[]
  /** Social media and contact links */
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
      icon: "Home01Icon",
    },
    {
      title: "Projects",
      url: "/projects",
      icon: "FolderCodeIcon",
    },
    {
      title: "Blog",
      url: "/blog",
      icon: "BookOpen02Icon",
    },
    {
      title: "Resume",
      url: "#",
      icon: "File02Icon",
    },
  ],

  social: [
    {
      title: "GitHub",
      url: "https://github.com",
      icon: "github",
    },
    {
      title: "LinkedIn",
      url: "https://linkedin.com",
      icon: "linkedin",
    },
    {
      title: "RSS",
      url: "/rss.xml",
      icon: "rss",
    },
    {
      title: "Email",
      url: "mailto:hello@sidshub.in",
      icon: "mail",
    },
  ],
}
