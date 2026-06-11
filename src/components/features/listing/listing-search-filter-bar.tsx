"use client"

import { useState, useEffect, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Cancel01Icon,
  SlidersHorizontalIcon,
} from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/react"
import { Badge } from "@/components/ui/react"
import { Button } from "@/components/ui/react"
import { ScrollArea, ScrollBar } from "@/components/ui/react"
import { Separator } from "@/components/ui/react"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/react"
import type { Locale } from "@/i18n/config"
import type { ListingSort } from "@/lib/api/listing-query"
import { t } from "@/i18n/ui"

interface SearchFilterBarProps {
  locale: Locale
  tags: string[]
  categories: string[]
  initialSearch: string
  initialTags: string[]
  initialCategories: string[]
  initialSortBy: ListingSort | null
  onFiltersChange: (
    search: string,
    tags: string[],
    categories: string[],
    sortBy: ListingSort | null
  ) => void
}

const SORT_OPTIONS = [
  { value: "newest", labelKey: "filters.newest" },
  { value: "oldest", labelKey: "filters.oldest" },
  { value: "title", labelKey: "filters.titleAZ" },
] as const

export function SearchFilterBar({
  locale,
  tags,
  categories,
  initialSearch,
  initialTags,
  initialCategories,
  initialSortBy,
  onFiltersChange,
}: SearchFilterBarProps) {
  const [search, setSearch] = useState(initialSearch)
  const [activeTags, setActiveTags] = useState<string[]>(initialTags)
  const [activeCategories, setActiveCategories] =
    useState<string[]>(initialCategories)
  const [sortBy, setSortBy] = useState<ListingSort | null>(initialSortBy)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange(search, activeTags, activeCategories, sortBy)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, activeTags, activeCategories, sortBy, onFiltersChange])

  const handleTagToggle = useCallback((tag: string) => {
    setActiveTags((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag]
    )
  }, [])

  const handleCategoryToggle = useCallback((category: string) => {
    setActiveCategories((current) =>
      current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category]
    )
  }, [])
  const handleSortToggle = useCallback((value: ListingSort) => {
    setSortBy((current) => (current === value ? null : value))
  }, [])

  const handleClear = useCallback(() => {
    setSearch("")
    setActiveTags([])
    setActiveCategories([])
    setSortBy(null)
  }, [])

  const hasFilters =
    search || activeTags.length > 0 || activeCategories.length > 0 || sortBy

  const activeFiltersCount =
    activeTags.length + activeCategories.length + (sortBy ? 1 : 0)

  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            strokeWidth={2}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            data-testid="search-input"
            type="text"
            placeholder={t(locale, "filters.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
            </button>
          )}
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative shrink-0">
              <HugeiconsIcon
                icon={SlidersHorizontalIcon}
                size={18}
                strokeWidth={2}
              />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {activeFiltersCount}
                </span>
              )}
              <span className="sr-only">{t(locale, "filters.title")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>{t(locale, "filters.title")}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 space-y-6 overflow-auto px-4 py-2">
              {/* Sort */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">
                  {t(locale, "filters.sortBy")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortToggle(option.value)}
                      className="cursor-pointer"
                    >
                      <Badge
                        variant={
                          sortBy === option.value ? "default" : "outline"
                        }
                      >
                        {t(locale, option.labelKey)}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">
                    {t(locale, "filters.tags")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        data-testid="tag-filter"
                        onClick={() => handleTagToggle(tag)}
                        className="cursor-pointer"
                      >
                        <Badge
                          variant={
                            activeTags.includes(tag) ? "default" : "outline"
                          }
                        >
                          #{tag}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <SheetFooter className="px-4 pt-2 pb-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setActiveTags([])
                  setActiveCategories([])
                  setSortBy(null)
                  setSheetOpen(false)
                }}
                disabled={
                  activeTags.length === 0 &&
                  activeCategories.length === 0 &&
                  !sortBy
                }
              >
                {t(locale, "filters.clearFilters")}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Category pills below search */}
      {categories.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-sm font-medium text-muted-foreground">
            {t(locale, "filters.categories")}
          </span>
          <Separator orientation="vertical" />
          <ScrollArea className="flex-1 whitespace-nowrap">
            <div className="flex items-center gap-1.5 py-1">
              {categories.map((category) => (
                <button
                  key={category}
                  data-testid="category-filter"
                  onClick={() => handleCategoryToggle(category)}
                  className="shrink-0 cursor-pointer"
                >
                  <Badge
                    variant={
                      activeCategories.includes(category)
                        ? "default"
                        : "outline"
                    }
                    className="capitalize"
                  >
                    {category}
                  </Badge>
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {hasFilters && (
            <button
              onClick={handleClear}
              className="shrink-0 text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              {t(locale, "filters.clearFilters")}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
