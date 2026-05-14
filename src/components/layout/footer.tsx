import { ThemeToggle } from "./theme-toggle"
import { LanguageSelector } from "./language-selector"
import { RssIcon } from "@/components/icons"
import type { Locale } from "@/i18n/config"
import { t } from "@/i18n/ui"

export function Footer({
  currentPath,
  locale = "en",
}: {
  currentPath: string
  locale?: Locale
}) {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex w-full flex-col items-center justify-between gap-2 px-6 py-3 sm:flex-row">
        <span className="text-sm text-muted-foreground">
          {t(locale, "footer.designedBy")} &copy; {year}
        </span>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LanguageSelector currentPath={currentPath} locale={locale} />
          <a
            href={`/${locale}/rss.xml`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="RSS Feed"
          >
            <RssIcon className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
