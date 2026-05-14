import type { ReactNode } from "react"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { isActiveLink } from "@/lib/utils"

export function NavLinks({
  items,
  currentPath,
}: {
  items: {
    title: string
    url: string
    icon: ReactNode
  }[]
  currentPath: string
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className="h-10 gap-4"
              isActive={isActiveLink(currentPath, item.url)}
            >
              <a href={item.url}>
                {item.icon}
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
