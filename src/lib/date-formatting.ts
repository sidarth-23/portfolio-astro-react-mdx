import type { Locale } from "@/i18n/config"

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
  // Strip fenced code blocks
  const withoutCodeBlocks = body.replace(/```[\s\S]*?```/g, "")
  // Strip inline code
  const withoutInlineCode = withoutCodeBlocks.replace(/`[^`]*`/g, "")
  // Strip HTML tags
  const withoutHtml = withoutInlineCode.replace(/<[^>]*>/g, "")
  // Strip markdown headings, bold, italic, links, images
  const withoutMarkdown = withoutHtml
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_]{1,2}/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\|/g, " ")
  // Count words
  const words = withoutMarkdown
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
  const minutes = Math.ceil(words.length / 200)
  return Math.max(minutes, 1)
}
