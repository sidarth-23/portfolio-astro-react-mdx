"use client"

import { PanelLeft } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"

import {
  useSidebar,
  Separator,
  Button,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/react"
import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config"
import { t } from "@/i18n/ui"
import { LanguageSelector } from "@/layouts/shell/language-selector"
import { resolvePageTitle } from "@/layouts/shell/sidebar-content"
import { ThemeToggle } from "@/layouts/shell/theme-toggle"

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

  const first = breadcrumbs[0]
  const middle = breadcrumbs.slice(1, -1)
  const last = breadcrumbs[breadcrumbs.length - 1]

  // With only a single middle segment, show it directly instead of hiding it
  // behind an ellipsis.
  if (middle.length === 1) {
    const mid = middle[0]

    return (
      <Breadcrumb className="min-w-0 overflow-hidden">
        <BreadcrumbList className="flex-nowrap">
          <BreadcrumbItem className="inline-flex">
            <BreadcrumbLink href={first.href}>{first.title}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="block" />
          <BreadcrumbItem>
            <BreadcrumbLink href={mid.href}>{mid.title}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="max-w-full min-w-0">
            <BreadcrumbPage className="block max-w-full truncate">
              {last.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  // One or two items: render normally without collapse.
  if (breadcrumbs.length <= 2) {
    return (
      <Breadcrumb className="min-w-0 overflow-hidden">
        <BreadcrumbList className="flex-nowrap">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem
                className={crumb.isCurrent ? "max-w-full min-w-0" : undefined}
              >
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

  // Collapse multiple middle items into an ellipsis dropdown.
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
        <BreadcrumbItem className="max-w-full min-w-0">
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
