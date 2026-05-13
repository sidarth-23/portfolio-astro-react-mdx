import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  FolderCodeIcon,
  BookOpen02Icon,
  File02Icon,
  GithubIcon,
  Linkedin01Icon,
} from "@hugeicons/core-free-icons"

const iconMap = {
  Home01Icon,
  FolderCodeIcon,
  BookOpen02Icon,
  File02Icon,
  GithubIcon,
  Linkedin01Icon,
} as const

type IconName = keyof typeof iconMap

export function NavLinks({
  items,
}: {
  items: {
    title: string
    url: string
    icon: string
  }[]
}) {
  return (
    <SidebarMenu>
      {items.map((item) => {
        const iconName = item.icon as IconName
        const IconComponent = iconMap[iconName]

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <a href={item.url}>
                {IconComponent && (
                  <HugeiconsIcon icon={IconComponent} strokeWidth={2} />
                )}
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
