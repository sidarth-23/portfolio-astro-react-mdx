"use client"

import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useMemo, useState } from "react"

import {
  Badge,
  Button,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Spinner,
} from "@/components/ui/react"
import type { Locale } from "@/i18n/config"
import { t } from "@/i18n/ui"
import type { SearchResult, SearchScope } from "@/lib/search/search"

import { HighlightedText } from "./highlighted-text"

interface GlobalSearchProps {
  locale: Locale
}

const MIN_QUERY_LENGTH = 2
const RESULT_LIMIT = 12
const DEBOUNCE_MS = 220

function buildSearchUrl(locale: Locale, query: string): string {
  const params = new URLSearchParams({ q: query, limit: String(RESULT_LIMIT) })
  return `/${locale}/api/search.json?${params.toString()}`
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  )
}

function useSearchShortcuts(onToggle: () => void, onOpen: () => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        onToggle()
        return
      }

      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault()
        onOpen()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onToggle, onOpen])
}

function ResultItem({
  result,
  locale,
  onSelect,
}: {
  result: SearchResult
  locale: Locale
  onSelect: (url: string) => void
}) {
  const kindLabel =
    result.kind === "page"
      ? t(locale, "search.kindPage")
      : result.kind === "section"
        ? t(locale, "search.kindSection")
        : t(locale, "search.kindItem")

  return (
    <CommandItem
      value={result.id}
      onSelect={() => onSelect(result.url)}
      className="flex-col items-start gap-1 py-2"
    >
      <div className="flex w-full flex-wrap items-center gap-2">
        <Badge variant="outline">{kindLabel}</Badge>
        {result.sectionTitle && (
          <span className="text-sm font-medium text-foreground">
            <HighlightedText
              text={result.sectionTitle}
              matches={result.sectionTitleMatches}
            />
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-foreground">
        <HighlightedText text={result.title} matches={result.titleMatches} />
      </p>
      {result.snippet && (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          <HighlightedText
            text={result.snippet}
            matches={result.snippetMatches}
          />
        </p>
      )}
    </CommandItem>
  )
}

export function GlobalSearch({ locale }: GlobalSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trimmedQuery = query.trim()

  useSearchShortcuts(
    () => setOpen((current) => !current),
    () => setOpen(true)
  )

  useEffect(() => {
    if (!open || trimmedQuery.length < MIN_QUERY_LENGTH) return

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(buildSearchUrl(locale, trimmedQuery), {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(t(locale, "search.error"))
        }

        const data = (await response.json()) as { results: SearchResult[] }
        setResults(data.results)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : t(locale, "search.error"))
        setResults([])
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [locale, open, trimmedQuery])

  const hasQuery = trimmedQuery.length >= MIN_QUERY_LENGTH
  const visibleError = hasQuery ? error : null

  const groups = useMemo(() => {
    const byScope = new Map<SearchScope, SearchResult[]>()
    if (!hasQuery) return byScope
    for (const result of results) {
      const group = byScope.get(result.scope)
      if (group) group.push(result)
      else byScope.set(result.scope, [result])
    }
    return byScope
  }, [results, hasQuery])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setQuery("")
      setResults([])
      setError(null)
      setIsLoading(false)
    }
  }

  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (value.trim().length < MIN_QUERY_LENGTH) {
      setResults([])
      setError(null)
      setIsLoading(false)
    }
  }

  const handleSelect = (url: string) => {
    setOpen(false)
    window.location.assign(url)
  }

  const showEmpty = hasQuery && !isLoading && !visibleError && groups.size === 0

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t(locale, "search.open")}
        onClick={() => setOpen(true)}
      >
        <HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={2} />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title={t(locale, "search.title")}
        description={t(locale, "search.description")}
        className="sm:max-w-xl"
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={handleQueryChange}
            placeholder={t(locale, "search.placeholder")}
          />
          <CommandList className="max-h-[min(60vh,28rem)]">
            {!hasQuery && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                {t(locale, "search.minChars")}
              </p>
            )}
            {visibleError && (
              <p className="px-3 py-6 text-center text-sm text-destructive">
                {visibleError}
              </p>
            )}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-muted-foreground">
                <Spinner className="size-3.5" />
                {t(locale, "search.loading")}
              </div>
            )}
            {showEmpty && (
              <CommandEmpty>{t(locale, "search.empty")}</CommandEmpty>
            )}

            {!isLoading && groups.has("blog") && (
              <CommandGroup heading={t(locale, "search.groupBlog")}>
                {groups.get("blog")!.map((result) => (
                  <ResultItem
                    key={result.id}
                    result={result}
                    locale={locale}
                    onSelect={handleSelect}
                  />
                ))}
              </CommandGroup>
            )}
            {!isLoading && groups.has("profile") && (
              <CommandGroup heading={t(locale, "search.groupProfile")}>
                {groups.get("profile")!.map((result) => (
                  <ResultItem
                    key={result.id}
                    result={result}
                    locale={locale}
                    onSelect={handleSelect}
                  />
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
