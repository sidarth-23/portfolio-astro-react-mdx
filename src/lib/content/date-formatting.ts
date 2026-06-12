import type { Locale } from "@/i18n/config"

import { normalizeWhitespace, stripMarkdownToText } from "./text"

export function formatDate(date: Date, locale: Locale = "en"): string {
  const localeMap: Record<Locale, string> = {
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
  }
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatShortDate(date: Date, locale: Locale = "en"): string {
  const localeMap: Record<Locale, string> = {
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
  }
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function estimateReadingTime(body: string): number {
  const words = normalizeWhitespace(stripMarkdownToText(body))
    .split(/\s+/)
    .filter((w) => w.length > 0)
  const minutes = Math.ceil(words.length / 200)
  return Math.max(minutes, 1)
}
