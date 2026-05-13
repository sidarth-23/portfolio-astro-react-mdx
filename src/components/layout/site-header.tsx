"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { PanelLeftOpenIcon, PanelLeftCloseIcon } from "@hugeicons/core-free-icons"
import { ThemeToggle } from "./theme-toggle"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { resolvePageTitle } from "@/lib/page-titles"

function HeaderSidebarTrigger() {
  const { toggleSidebar, open, openMobile, isMobile } = useSidebar()
  const isOpen = isMobile ? openMobile : open

  return (
    <Button
      data-sidebar="trigger"
      variant="ghost"
      size="icon-sm"
      onClick={toggleSidebar}
    >
      <HugeiconsIcon
        icon={isOpen ? PanelLeftCloseIcon : PanelLeftOpenIcon}
        strokeWidth={2}
        className="size-5"
      />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

export function SiteHeader({
  currentPath,
  pageTitle,
}: {
  currentPath: string
  pageTitle?: string
}) {
  const title = resolvePageTitle(currentPath, pageTitle)

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full shrink-0 items-center justify-between px-4 md:max-w-5xl">
        <div className="flex items-center gap-3">
          <HeaderSidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
