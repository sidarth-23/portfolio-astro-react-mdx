"use client"

import * as React from "react"
import { useSidebar } from "@/components/ui/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PanelLeft } from "@hugeicons/core-free-icons"
import { ThemeToggle } from "@/layouts/shell/theme-toggle"
import { Separator } from "@/components/ui/react"
import { Button } from "@/components/ui/react"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/react"
import { LanguageSelector } from "@/layouts/shell/language-selector"
import { resolvePageTitle } from "@/layouts/shell/sidebar-content"
import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config"
import { t } from "@/i18n/ui"

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

function buildBreadcrumbs(
  currentPath: string,
  pageTitle?: string
): BreadcrumbSegment[] {
  const segments = currentPath.split("/").filter(Boolean)

  // First segment is locale, skip it for breadcrumbs
  const pathSegments = segments.slice(1)

  const locale: Locale = isValidLocale(segments[0])
    ? segments[0]
    : defaultLocale

  const homeTitle =
    resolvePageTitle(`/${locale}`, locale) || t(locale, "nav.home")

  if (pathSegments.length === 0) {
    return [{ title: homeTitle, href: "/" + locale, isCurrent: true }]
  }

  const breadcrumbs: BreadcrumbSegment[] = [
    { title: homeTitle, href: `/${locale}`, isCurrent: false },
  ]

  let accumulatedPath = ""
  for (let i = 0; i < pathSegments.length; i++) {
    accumulatedPath += "/" + pathSegments[i]
    const isLast = i === pathSegments.length - 1
    const title =
      isLast && pageTitle
        ? pageTitle
        : resolvePageTitle(`/${locale}${accumulatedPath}`, locale) ||
          pathSegments[i]
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")

    breadcrumbs.push({
      title,
      href: `/${locale}${accumulatedPath}`,
      isCurrent: isLast,
    })
  }

  return breadcrumbs
}

export function Breadcrumbs({
  currentPath,
  pageTitle,
}: {
  currentPath: string
  pageTitle?: string
}) {
  const breadcrumbs = buildBreadcrumbs(currentPath, pageTitle)

  // If only 2 items (Home + 1), no collapse
  if (breadcrumbs.length <= 2) {
    return (
      <Breadcrumb className="min-w-0 overflow-hidden">
        <BreadcrumbList className="flex-nowrap">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className={crumb.isCurrent ? "min-w-0 max-w-full" : undefined}>
                {crumb.isCurrent ? (
                  <BreadcrumbPage className="block max-w-full truncate">
                    {crumb.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>
                    {crumb.title}
                  </BreadcrumbLink>
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
    <Breadcrumb className="min-w-0 overflow-hidden">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem className="hidden sm:inline-flex">
          <BreadcrumbLink href={first.href}>{first.title}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden sm:block" />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-1">
              <BreadcrumbEllipsis />
              <span className="sr-only">Show more</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem className="sm:hidden" asChild>
                <a href={first.href} className="cursor-pointer">
                  {first.title}
                </a>
              </DropdownMenuItem>
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
        <BreadcrumbItem className="min-w-0 max-w-full">
          <BreadcrumbPage className="block max-w-full truncate">
            {last.title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function SiteHeader({
  currentPath,
  pageTitle,
  locale = "en",
}: {
  currentPath: string
  pageTitle?: string
  locale?: Locale
}) {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full shrink-0 items-center justify-between px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
          <HeaderSidebarTrigger />
          <Separator orientation="vertical" />
          <Breadcrumbs currentPath={currentPath} pageTitle={pageTitle} />
        </div>
        <div className="flex shrink-0 items-center gap-1 bg-background">
          <LanguageSelector currentPath={currentPath} locale={locale} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
