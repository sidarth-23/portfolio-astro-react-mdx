import * as React from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "./app-sidebar"
import { SiteHeader } from "./site-header"
import { Footer } from "./footer"

export function AppShell({
  children,
  currentPath,
  avatarSrc,
  pageTitle,
}: {
  children: React.ReactNode
  currentPath: string
  avatarSrc: string
  pageTitle?: string
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar currentPath={currentPath} avatarSrc={avatarSrc} />
        <SidebarInset className="min-h-svh">
          <SiteHeader currentPath={currentPath} pageTitle={pageTitle} />
          <div className="flex-1">
            {children}
          </div>
          <Footer currentPath={currentPath} />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
