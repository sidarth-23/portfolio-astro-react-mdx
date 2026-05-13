export const locales = ["en", "hi", "fr"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const localeLabels: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  fr: "Français",
}

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}
