"use client"

import * as React from "react"
import { useSidebar } from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { PanelLeft } from "@hugeicons/core-free-icons"
import { ThemeToggle } from "./theme-toggle"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { resolvePageTitle } from "@/lib/sidebar-content"

function HeaderSidebarTrigger() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      variant="ghost"
      size="icon-sm"
      onClick={toggleSidebar}
    >
      <HugeiconsIcon icon={PanelLeft} strokeWidth={2} className="size-5" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

interface BreadcrumbSegment {
  title: string
  href: string
  isCurrent: boolean
}

function buildBreadcrumbs(currentPath: string, pageTitle?: string): BreadcrumbSegment[] {
  const segments = currentPath.split("/").filter(Boolean)
  
  if (segments.length === 0) {
    return [{ title: "Home", href: "/", isCurrent: true }]
  }

  const breadcrumbs: BreadcrumbSegment[] = [
    { title: "Home", href: "/", isCurrent: false },
  ]

  let accumulatedPath = ""
  for (let i = 0; i < segments.length; i++) {
    accumulatedPath += "/" + segments[i]
    const isLast = i === segments.length - 1
    const title = isLast && pageTitle
      ? pageTitle
      : resolvePageTitle(accumulatedPath) || segments[i]
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    
    breadcrumbs.push({
      title,
      href: accumulatedPath,
      isCurrent: isLast,
    })
  }

  return breadcrumbs
}

function Breadcrumbs({ currentPath, pageTitle }: { currentPath: string; pageTitle?: string }) {
  const breadcrumbs = buildBreadcrumbs(currentPath, pageTitle)

  // If only 2 items (Home + 1), no collapse
  if (breadcrumbs.length <= 2) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {crumb.isCurrent ? (
                  <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>{crumb.title}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  // Collapse middle items into ellipsis dropdown
  const first = breadcrumbs[0]
  const middle = breadcrumbs.slice(1, -1)
  const last = breadcrumbs[breadcrumbs.length - 1]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={first.href}>{first.title}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer">
              <BreadcrumbEllipsis />
              <span className="sr-only">Show more</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {middle.map((crumb) => (
                <DropdownMenuItem key={crumb.href} asChild>
                  <a href={crumb.href} className="cursor-pointer">
                    {crumb.title}
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{last.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function SiteHeader({
  currentPath,
  pageTitle,
}: {
  currentPath: string
  pageTitle?: string
}) {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full shrink-0 items-center justify-between px-4 md:max-w-5xl">
        <div className="flex items-center gap-3">
          <HeaderSidebarTrigger />
          <Separator orientation="vertical" />
          <Breadcrumbs currentPath={currentPath} pageTitle={pageTitle} />
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
