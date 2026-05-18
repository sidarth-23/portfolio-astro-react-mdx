"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Globe02Icon,
  SparklesIcon,
  ArrowDown01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  locales,
  localeLabels,
  defaultLocale,
  type Locale,
} from "@/i18n/config"
import { t } from "@/i18n/ui"

interface LanguageSelectorProps {
  currentPath: string
  locale?: Locale
  variant?: "default" | "expanded"
}

export function LanguageSelector({
  currentPath,
  locale = "en",
  variant = "default",
}: LanguageSelectorProps) {
  const handleChange = (value: string) => {
    const segments = currentPath.split("/").filter(Boolean)
    const currentLocale = segments[0] || defaultLocale

    if (value === currentLocale) return

    if (segments.length > 0) {
      segments[0] = value
    } else {
      segments.unshift(value)
    }

    // eslint-disable-next-line react-hooks/immutability
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

  const content = (
    <>
      {locales.map((loc) => (
        <DropdownMenuItem
          key={loc}
          onClick={() => handleChange(loc)}
          className="gap-3 px-3 py-2"
        >
          <span className="flex w-4 items-center justify-center">
            {locale === loc && (
              <HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={2} />
            )}
          </span>
          <a
            href={getPathForLocale(loc)}
            className="flex flex-1 items-baseline gap-1.5"
            onClick={(e) => e.preventDefault()}
          >
            <span className="text-sm">{localeLabels[loc]}</span>
            {loc !== defaultLocale && (
              <span
                title={t(loc, "lang.aiGenerated")}
                className="relative -top-1.5 ml-0.5 inline-flex"
              >
                <HugeiconsIcon
                  icon={SparklesIcon}
                  size={6}
                  strokeWidth={2}
                  className="text-sidebar-primary/70"
                />
              </span>
            )}
          </a>
        </DropdownMenuItem>
      ))}
    </>
  )

  if (variant === "expanded") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-36 justify-start gap-2 px-2">
            <HugeiconsIcon
              icon={Globe02Icon}
              strokeWidth={2}
              className="size-4 shrink-0 text-muted-foreground"
            />
            <span className="text-sm">{localeLabels[locale]}</span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="ml-auto size-4 opacity-50"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-auto">
          {content}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="relative size-9">
          <HugeiconsIcon
            icon={Globe02Icon}
            strokeWidth={2}
            className="size-4"
          />
          <span className="sr-only">{t(locale, "lang.selector")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-auto">
        {content}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
