"use client"

import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useMemo, useState, useSyncExternalStore } from "react"

import { Kbd, KbdGroup } from "@/components/ui/kbd"
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
  CommandSeparator,
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

const emptySubscribe = () => () => {}

function useIsMac() {
  return useSyncExternalStore(
    emptySubscribe,
    () => /Mac|iPhone|iPad|iPod/i.test(navigator.platform),
    () => false
  )
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
      className="flex-col items-start gap-1.5 px-3 py-2.5"
    >
      <div className="flex w-full items-center gap-2">
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          <HighlightedText text={result.title} matches={result.titleMatches} />
        </p>
        <Badge variant="outline" className="shrink-0 text-[10px]">
          {kindLabel}
        </Badge>
      </div>
      {result.sectionTitle && (
        <p className="text-xs text-muted-foreground">
          <HighlightedText
            text={result.sectionTitle}
            matches={result.sectionTitleMatches}
          />
        </p>
      )}
      {result.snippet && (
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
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
  const isMac = useIsMac()

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
        variant="outline"
        size="icon-sm"
        aria-label={t(locale, "search.open")}
        onClick={() => setOpen(true)}
        className="max-md:border-transparent max-md:bg-transparent md:h-8 md:w-56 md:justify-start md:gap-2 md:rounded-lg md:bg-muted/50 md:px-2.5 md:font-normal md:text-muted-foreground md:shadow-none max-md:dark:border-transparent max-md:dark:bg-transparent md:dark:bg-input/30"
      >
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={2}
          className="size-4 shrink-0"
        />
        <span className="hidden flex-1 truncate text-left text-sm md:inline-block">
          {t(locale, "search.open")}
        </span>
        <KbdGroup className="ml-auto hidden md:inline-flex">
          <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
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
              <p className="px-3 py-10 text-center text-sm text-muted-foreground">
                {t(locale, "search.minChars")}
              </p>
            )}
            {visibleError && (
              <p className="px-3 py-10 text-center text-sm text-destructive">
                {visibleError}
              </p>
            )}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 px-3 py-10 text-sm text-muted-foreground">
                <Spinner className="size-3.5" />
                {t(locale, "search.loading")}
              </div>
            )}
            {showEmpty && (
              <CommandEmpty className="py-10">
                {t(locale, "search.empty")}
              </CommandEmpty>
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
            {!isLoading && groups.has("blog") && groups.has("profile") && (
              <CommandSeparator className="my-1" />
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
          <div className="hidden items-center gap-4 border-t px-3 py-2 text-xs text-muted-foreground sm:flex">
            <span className="flex items-center gap-1.5">
              <KbdGroup>
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
              </KbdGroup>
              {t(locale, "search.hintNavigate")}
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>↵</Kbd>
              {t(locale, "search.hintOpen")}
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <Kbd>Esc</Kbd>
              {t(locale, "search.hintClose")}
            </span>
          </div>
        </Command>
      </CommandDialog>
    </>
  )
}
