import type { ReactNode } from "react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  className,
}: {
  items: {
    title: string
    url: string
    icon: ReactNode
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
                  target={item.url.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.url.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
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
