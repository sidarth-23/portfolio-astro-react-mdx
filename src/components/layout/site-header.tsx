"use client"

import * as React from "react"
import { useSidebar } from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { PanelLeft, SparklesIcon } from "@hugeicons/core-free-icons"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { resolvePageTitle } from "@/lib/sidebar-content"
import {
  locales,
  localeLabels,
  defaultLocale,
  isValidLocale,
  type Locale,
} from "@/i18n/config"
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

  const locale: Locale = isValidLocale(segments[0]) ? segments[0] : defaultLocale

  if (pathSegments.length === 0) {
    return [{ title: t(locale, "nav.home"), href: "/" + locale, isCurrent: true }]
  }

  const breadcrumbs: BreadcrumbSegment[] = [
    { title: t(locale, "nav.home"), href: `/${locale}`, isCurrent: false },
  ]

  let accumulatedPath = ""
  for (let i = 0; i < pathSegments.length; i++) {
    accumulatedPath += "/" + pathSegments[i]
    const isLast = i === pathSegments.length - 1
    const title = isLast && pageTitle
      ? pageTitle
      : resolvePageTitle(`/${locale}${accumulatedPath}`, locale) || pathSegments[i]
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    
    breadcrumbs.push({
      title,
      href: `/${locale}${accumulatedPath}`,
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

function LanguageSelector({ currentPath, locale }: { currentPath: string; locale: Locale }) {
  const handleChange = (value: string) => {
    const segments = currentPath.split("/").filter(Boolean)
    const currentLocale = segments[0] || defaultLocale
    
    if (value === currentLocale) return
    
    // Replace locale in path
    if (segments.length > 0) {
      segments[0] = value
    } else {
      segments.unshift(value)
    }
    
    window.location.href = "/" + segments.join("/")
  }

  const getPathForLocale = (targetLocale: Locale): string => {
    const segments = currentPath.split("/").filter(Boolean)
    if (segments.length > 0) {
      segments[0] = targetLocale
    } else {
      segments.unshift(targetLocale)
    }
    return "/" + segments.join("/")
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={locale} onValueChange={handleChange}>
        <SelectTrigger className="w-auto min-w-[120px] h-8 text-xs" size="sm">
          <SelectValue placeholder={t(locale, "lang.selector")} />
        </SelectTrigger>
        <SelectContent>
          {locales.map((loc) => (
            <SelectItem key={loc} value={loc} className="text-xs">
              <a href={getPathForLocale(loc)} className="flex items-center gap-2">
                <span>{localeLabels[loc]}</span>
                {loc !== defaultLocale && (
                  <span title={t(loc, "lang.aiGenerated")}>
                    <HugeiconsIcon
                      icon={SparklesIcon}
                      size={14}
                      strokeWidth={2}
                      className="text-primary/70"
                    />
                  </span>
                )}
              </a>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
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
      <div className="mx-auto flex h-14 w-full shrink-0 items-center justify-between px-4 md:max-w-5xl">
        <div className="flex items-center gap-3">
          <HeaderSidebarTrigger />
          <Separator orientation="vertical" />
          <Breadcrumbs currentPath={currentPath} pageTitle={pageTitle} />
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector currentPath={currentPath} locale={locale} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
