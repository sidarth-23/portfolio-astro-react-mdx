import * as React from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/react"
import { TooltipProvider } from "@/components/ui/react"
import { AppSidebar } from "@/layouts/shell/app-sidebar"
import { SiteHeader } from "@/layouts/shell/site-header"
import { Footer } from "@/layouts/shell/footer"
import type { Locale } from "@/i18n/config"

export function AppShell({
  children,
  currentPath,
  avatarSrc,
  avatarSrcSet,
  pageTitle,
  locale = "en",
}: {
  children: React.ReactNode
  currentPath: string
  avatarSrc: string
  avatarSrcSet?: string
  pageTitle?: string
  locale?: Locale
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar
          currentPath={currentPath}
          avatarSrc={avatarSrc}
          avatarSrcSet={avatarSrcSet}
          locale={locale}
        />
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
