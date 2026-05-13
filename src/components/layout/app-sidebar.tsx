"use client"

import * as React from "react"

import { NavLinks } from "./nav-links"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { sidebarContent } from "@/lib/sidebar-content"
import { NavFooter } from "./nav-footer"

export function AppSidebar({
  currentPath,
  avatarSrc,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  currentPath: string
  avatarSrc: string
}) {
  const { profile, navigation, social } = sidebarContent

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex flex-col items-center gap-3 px-4 py-6">
        <img
          src={avatarSrc}
          alt={profile.name}
          className="size-20 rounded-full object-cover"
          loading="eager"
          decoding="sync"
        />
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="font-semibold text-sidebar-foreground">
            {profile.name}
          </h3>
          <p className="text-xs text-sidebar-foreground/70">{profile.title}</p>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="mt-2">
        <NavLinks items={navigation} currentPath={currentPath} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter items={social} />
      </SidebarFooter>
    </Sidebar>
  )
}
