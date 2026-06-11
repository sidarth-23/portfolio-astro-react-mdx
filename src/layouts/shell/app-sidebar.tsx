"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/react"
import type { Locale } from "@/i18n/config"
import { NavFooter } from "@/layouts/shell/nav-footer"
import { NavLinks } from "@/layouts/shell/nav-links"
import { NavSecondary } from "@/layouts/shell/nav-secondary"
import { sidebarContent } from "@/layouts/shell/sidebar-content"

export function AppSidebar({
  currentPath,
  avatarSrc,
  avatarSrcSet,
  locale = "en",
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  currentPath: string
  avatarSrc: string
  avatarSrcSet?: string
  locale?: Locale
}) {
  const { profile, navigation, secondary, social } = sidebarContent(locale)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex flex-col items-center gap-3 px-4 py-6">
        <img
          src={avatarSrc}
          srcSet={avatarSrcSet}
          sizes="80px"
          alt={profile.name}
          className="size-20 rounded-full object-cover"
          loading="eager"
          decoding="sync"
          width={80}
          height={80}
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
        <NavSecondary items={secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <NavFooter items={social} />
      </SidebarFooter>
    </Sidebar>
  )
}
