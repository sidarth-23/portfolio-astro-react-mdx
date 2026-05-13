"use client"

import * as React from "react"

import { NavLinks } from "@/components/nav-links"
import { SocialClouds } from "@/components/social-clouds"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { sidebarContent } from "@/lib/sidebar-content"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile, navigation, social } = sidebarContent

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex flex-col items-center gap-3 px-4 py-6">
        <Avatar className="size-20">
          <AvatarImage
            src={profile.avatar}
            alt={profile.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = "none"
            }}
          />
          <AvatarFallback className="bg-sidebar-primary text-2xl font-semibold text-sidebar-primary-foreground">
            {profile.fallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="font-semibold text-sidebar-foreground">
            {profile.name}
          </h3>
          <p className="text-xs text-sidebar-foreground/70">{profile.title}</p>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2 py-4">
        <NavLinks items={navigation} />
      </SidebarContent>

      <SidebarFooter className="px-4 py-4">
        <SidebarSeparator className="mb-4" />
        <SocialClouds items={social} />
      </SidebarFooter>
    </Sidebar>
  )
}
