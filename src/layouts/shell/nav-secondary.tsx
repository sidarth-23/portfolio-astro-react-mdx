import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/react"

import type { ReactNode } from "react"

export function NavSecondary({
  items,
  className,
}: {
  items: {
    title: string
    url: string
    icon: ReactNode
    isExternal: boolean
  }[]
  className?: string
}) {
  return (
    <SidebarGroup className={className}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <a
                  href={item.url}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={
                    item.isExternal ? "noopener noreferrer" : undefined
                  }
                >
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
