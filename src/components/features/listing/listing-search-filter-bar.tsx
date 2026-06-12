"use client"

import {
  ArrowUpDownIcon,
  Calendar03Icon,
  Cancel01Icon,
  Folder01Icon,
  Tag01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useState } from "react"

import {
  Badge,
  Button,
  Calendar,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/react"
import type { Locale } from "@/i18n/config"
import { t } from "@/i18n/ui"
import type { ListingFilterState, ListingSort } from "@/lib/api/listing-query"

import type { DateRange } from "react-day-picker"

interface SearchFilterBarProps {
  locale: Locale
  tags: string[]
  categories: string[]
  initialFilters: ListingFilterState
  onFiltersChange: (filters: ListingFilterState) => void
}

const SORT_OPTIONS = [
  { value: "date-desc", labelKey: "filters.sortNewest" },
  { value: "date-asc", labelKey: "filters.sortOldest" },
  { value: "title-asc", labelKey: "filters.sortTitleAz" },
  { value: "title-desc", labelKey: "filters.sortTitleZa" },
] as const

const chipVariants = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.85 },
}

// Local date parts, not toISOString(), so the selected day survives timezones.
function toDateParam(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function fromDateParam(value: string | null): Date | undefined {
  if (!value) return undefined
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function formatDateRange(
  locale: Locale,
  from: string | null,
  to: string | null
): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  const fromDate = fromDateParam(from)
  const toDate = fromDateParam(to)
  if (fromDate && toDate) return formatter.formatRange(fromDate, toDate)
  if (fromDate) return `${formatter.format(fromDate)} –`
  if (toDate) return `– ${formatter.format(toDate)}`
  return ""
}

export function SearchFilterBar({
  locale,
  tags,
  categories,
  initialFilters,
  onFiltersChange,
}: SearchFilterBarProps) {
  const [filters, setFilters] = useState<ListingFilterState>(initialFilters)
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const applyFilters = useCallback(
    (update: Partial<ListingFilterState>) => {
      setFilters((current) => {
        const next = { ...current, ...update }
        onFiltersChange(next)
        return next
      })
    },
    [onFiltersChange]
  )

  const handleTagToggle = useCallback(
    (tag: string) => {
      applyFilters({
        tags: filters.tags.includes(tag)
          ? filters.tags.filter((current) => current !== tag)
          : [...filters.tags, tag],
      })
    },
    [filters.tags, applyFilters]
  )

  const handleCategoryToggle = useCallback(
    (category: string) => {
      applyFilters({
        categories: filters.categories.includes(category)
          ? filters.categories.filter((current) => current !== category)
          : [...filters.categories, category],
      })
    },
    [filters.categories, applyFilters]
  )

  const handleSortChange = useCallback(
    (value: string) => {
      applyFilters({
        sort: value === "date-desc" ? null : (value as ListingSort),
      })
    },
    [applyFilters]
  )

  const handleDateRangeSelect = useCallback(
    (range: DateRange | undefined) => {
      applyFilters({
        from: range?.from ? toDateParam(range.from) : null,
        to: range?.to ? toDateParam(range.to) : null,
      })
    },
    [applyFilters]
  )

  const handleDatePreset = useCallback(
    (from: Date | null, to: Date | null) => {
      applyFilters({
        from: from ? toDateParam(from) : null,
        to: to ? toDateParam(to) : null,
      })
      setDatePickerOpen(false)
    },
    [applyFilters]
  )

  const handleClearDates = useCallback(() => {
    applyFilters({ from: null, to: null })
  }, [applyFilters])

  const handleClear = useCallback(() => {
    applyFilters({ tags: [], categories: [], sort: null, from: null, to: null })
  }, [applyFilters])

  const hasDateRange = Boolean(filters.from || filters.to)
  const dateRangeLabel = formatDateRange(locale, filters.from, filters.to)

  const activeChips = [
    ...filters.categories.map((value) => ({
      kind: "category" as const,
      value,
    })),
    ...filters.tags.map((value) => ({ kind: "tag" as const, value })),
    ...(hasDateRange ? [{ kind: "date" as const, value: dateRangeLabel }] : []),
  ]

  const now = new Date()
  const datePresets = [
    {
      labelKey: "filters.datePresetLast6Months" as const,
      from: new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
      to: now,
    },
    {
      labelKey: "filters.datePresetThisYear" as const,
      from: new Date(now.getFullYear(), 0, 1),
      to: now,
    },
    {
      labelKey: "filters.datePresetLastYear" as const,
      from: new Date(now.getFullYear() - 1, 0, 1),
      to: new Date(now.getFullYear() - 1, 11, 31),
    },
    {
      labelKey: "filters.datePresetAllTime" as const,
      from: null,
      to: null,
    },
  ]

  return (
    <div className="mb-8 space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Categories combobox */}
        {categories.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                data-testid="category-filter-trigger"
                aria-label={t(locale, "filters.categories")}
              >
                <HugeiconsIcon icon={Folder01Icon} size={14} strokeWidth={2} />
                <span className="hidden sm:inline">
                  {t(locale, "filters.categories")}
                </span>
                {filters.categories.length > 0 && (
                  <Badge variant="secondary" className="px-1.5">
                    {filters.categories.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="start">
              <Command>
                <CommandInput
                  placeholder={t(locale, "filters.categoriesSearchPlaceholder")}
                />
                <CommandList>
                  <CommandEmpty>
                    {t(locale, "filters.categoriesEmpty")}
                  </CommandEmpty>
                  {categories.map((category) => {
                    const isActive = filters.categories.includes(category)
                    return (
                      <CommandItem
                        key={category}
                        value={category}
                        data-testid="category-filter-option"
                        onSelect={() => handleCategoryToggle(category)}
                        className="capitalize"
                      >
                        <HugeiconsIcon
                          icon={Tick02Icon}
                          size={14}
                          strokeWidth={2}
                          className={isActive ? "opacity-100" : "opacity-0"}
                        />
                        {category}
                      </CommandItem>
                    )
                  })}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {/* Tags combobox */}
          {tags.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="tag-filter-trigger"
                  aria-label={t(locale, "filters.tags")}
                >
                  <HugeiconsIcon icon={Tag01Icon} size={14} strokeWidth={2} />
                  <span className="hidden sm:inline">
                    {t(locale, "filters.tags")}
                  </span>
                  {filters.tags.length > 0 && (
                    <Badge variant="secondary" className="px-1.5">
                      {filters.tags.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <Command>
                  <CommandInput
                    placeholder={t(locale, "filters.tagsSearchPlaceholder")}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {t(locale, "filters.tagsEmpty")}
                    </CommandEmpty>
                    {tags.map((tag) => {
                      const isActive = filters.tags.includes(tag)
                      return (
                        <CommandItem
                          key={tag}
                          value={tag}
                          data-testid="tag-filter-option"
                          onSelect={() => handleTagToggle(tag)}
                        >
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            size={14}
                            strokeWidth={2}
                            className={isActive ? "opacity-100" : "opacity-0"}
                          />
                          #{tag}
                        </CommandItem>
                      )
                    })}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {/* Date range picker */}
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                data-testid="date-filter-trigger"
                aria-label={t(locale, "filters.dateRange")}
              >
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={14}
                  strokeWidth={2}
                />
                <span className="hidden sm:inline">
                  {hasDateRange
                    ? dateRangeLabel
                    : t(locale, "filters.dateRange")}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="flex flex-wrap gap-1 border-b p-2">
                {datePresets.map((preset) => (
                  <Button
                    key={preset.labelKey}
                    variant="ghost"
                    size="xs"
                    data-testid="date-preset"
                    onClick={() => handleDatePreset(preset.from, preset.to)}
                  >
                    {t(locale, preset.labelKey)}
                  </Button>
                ))}
              </div>
              <Calendar
                mode="range"
                numberOfMonths={2}
                defaultMonth={fromDateParam(filters.from)}
                selected={{
                  from: fromDateParam(filters.from),
                  to: fromDateParam(filters.to),
                }}
                onSelect={handleDateRangeSelect}
              />
            </PopoverContent>
          </Popover>

          {/* Sort */}
          <Select
            value={filters.sort ?? "date-desc"}
            onValueChange={handleSortChange}
          >
            <SelectTrigger
              size="sm"
              data-testid="sort-select"
              aria-label={t(locale, "filters.sortBy")}
            >
              <HugeiconsIcon icon={ArrowUpDownIcon} size={14} strokeWidth={2} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(locale, option.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filter chips */}
      <AnimatePresence initial={false}>
        {activeChips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-1.5 py-1">
              <AnimatePresence mode="popLayout" initial={false}>
                {activeChips.map((chip) => (
                  <motion.div
                    key={`${chip.kind}:${chip.value}`}
                    layout
                    variants={chipVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <Badge
                      variant="secondary"
                      className={`gap-1 pr-1 ${chip.kind === "category" ? "capitalize" : ""}`}
                      data-testid="active-filter-chip"
                    >
                      {chip.kind === "tag" ? `#${chip.value}` : chip.value}
                      <button
                        onClick={() => {
                          if (chip.kind === "tag") handleTagToggle(chip.value)
                          else if (chip.kind === "category")
                            handleCategoryToggle(chip.value)
                          else handleClearDates()
                        }}
                        aria-label={`${t(locale, "filters.removeFilter")}: ${chip.value}`}
                        className="cursor-pointer rounded-full p-0.5 hover:bg-foreground/10"
                      >
                        <HugeiconsIcon
                          icon={Cancel01Icon}
                          size={12}
                          strokeWidth={2}
                        />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                onClick={handleClear}
                className="ml-1 shrink-0 cursor-pointer text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                {t(locale, "filters.clearFilters")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
