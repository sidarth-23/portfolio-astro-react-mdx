import * as React from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "./app-sidebar"
import { SiteHeader } from "./site-header"
import { Footer } from "./footer"
import type { Locale } from "@/i18n/config"

export function AppShell({
  children,
  currentPath,
  avatarSrc,
  pageTitle,
  locale = "en",
}: {
  children: React.ReactNode
  currentPath: string
  avatarSrc: string
  pageTitle?: string
  locale?: Locale
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar currentPath={currentPath} avatarSrc={avatarSrc} locale={locale} />
        <SidebarInset>
          <SiteHeader currentPath={currentPath} pageTitle={pageTitle} locale={locale} />
          <div className="flex-1">
            {children}
          </div>
          <Footer currentPath={currentPath} locale={locale} />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
