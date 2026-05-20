"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Search } from "lucide-react"
import type { Locale } from "@/i18n/config"
import { t } from "@/i18n/ui"

interface SearchFilterBarProps {
  locale: Locale
  tags: string[]
  initialSearch: string
  initialTag: string | null
  onFiltersChange: (search: string, tag: string | null) => void
}

export function SearchFilterBar({
  locale,
  tags,
  initialSearch,
  initialTag,
  onFiltersChange,
}: SearchFilterBarProps) {
  const [search, setSearch] = useState(initialSearch)
  const [activeTag, setActiveTag] = useState<string | null>(initialTag)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange(search, activeTag)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, activeTag, onFiltersChange])

  const handleTagClick = useCallback(
    (tag: string) => {
      setActiveTag((current) => (current === tag ? null : tag))
    },
    []
  )

  const handleClear = useCallback(() => {
    setSearch("")
    setActiveTag(null)
  }, [])

  const hasFilters = search || activeTag

  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t(locale, "filters.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="cursor-pointer"
            >
              <Badge
                variant={activeTag === tag ? "default" : "outline"}
                className="text-muted-foreground/80 transition-colors"
              >
                #{tag}
              </Badge>
            </button>
          ))}
          {hasFilters && (
            <button
              onClick={handleClear}
              className="ml-2 text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              {t(locale, "filters.clearFilters")}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
