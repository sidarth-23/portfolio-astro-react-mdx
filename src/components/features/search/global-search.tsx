"use client"

import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useMemo, useState } from "react"

import {
  Badge,
  Button,
  Input,
  ScrollArea,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Spinner,
} from "@/components/ui/react"
import type { Locale } from "@/i18n/config"
import type { SearchResult } from "@/lib/search/search"

interface GlobalSearchProps {
  locale: Locale
}

function buildSearchUrl(locale: Locale, query: string): string {
  const params = new URLSearchParams({ q: query })
  return `/${locale}/api/search.json?${params.toString()}`
}

function ResultTypeBadge({ kind }: { kind: SearchResult["kind"] }) {
  const label =
    kind === "page" ? "Page" : kind === "section" ? "Section" : "Item"

  return <Badge variant="outline">{label}</Badge>
}

export function GlobalSearch({ locale }: GlobalSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trimmedQuery = useMemo(() => query.trim(), [query])

  useEffect(() => {
    if (!open) return

    if (trimmedQuery.length < 2) {
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(buildSearchUrl(locale, trimmedQuery), {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error("Failed to search")
        }

        const data = (await response.json()) as { results: SearchResult[] }
        setResults(data.results)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : "Failed to search")
        setResults([])
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }, 220)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [locale, open, trimmedQuery])

  const visibleResults = trimmedQuery.length >= 2 ? results : []
  const visibleError = trimmedQuery.length >= 2 ? error : null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Search site">
          <HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={2} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Search</SheetTitle>
          <SheetDescription>
            Search posts, profile details, and section-level content.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              strokeWidth={2}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search content"
              className="pr-10 pl-10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
              </button>
            )}
          </div>

          <Separator />

          <ScrollArea className="h-[min(60vh,32rem)] pr-3">
            <div className="space-y-3 pb-2">
              {visibleError && (
                <p className="text-sm text-destructive">{visibleError}</p>
              )}
              {trimmedQuery.length < 2 && (
                <p className="text-sm text-muted-foreground">
                  Type at least 2 characters.
                </p>
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner className="size-3.5" />
                  Searching...
                </div>
              )}

              {!isLoading &&
                trimmedQuery.length >= 2 &&
                visibleResults.length === 0 &&
                !visibleError && (
                  <p className="text-sm text-muted-foreground">
                    No results found.
                  </p>
                )}

              {visibleResults.map((result) => (
                <SheetClose asChild key={result.id}>
                  <a
                    href={result.url}
                    className="block rounded-lg border bg-card p-4 transition hover:border-primary/40 hover:bg-accent/40"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <ResultTypeBadge kind={result.kind} />
                      {result.sectionTitle && (
                        <span className="text-sm font-medium text-foreground">
                          {result.sectionTitle}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {result.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {result.snippet}
                    </p>
                  </a>
                </SheetClose>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
