import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeAll, describe, expect, it, vi } from "vitest"

import { renderReact } from "@/test/utils"

import { SearchFilterBar } from "./listing-search-filter-bar"

// The test DOM lacks the pointer/scroll/observer APIs Radix and cmdk rely on.
beforeAll(() => {
  Element.prototype.hasPointerCapture = () => false
  Element.prototype.releasePointerCapture = () => {}
  Element.prototype.scrollIntoView = () => {}
  if (typeof globalThis.ResizeObserver === "undefined") {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
})

function setupUser() {
  return userEvent.setup({ pointerEventsCheck: 0 })
}

const emptyFilters = {
  tags: [],
  categories: [],
  sort: null,
  from: null,
  to: null,
}

describe("SearchFilterBar", () => {
  const defaultProps = {
    locale: "en" as const,
    tags: ["react", "astro"],
    categories: ["Web Application", "Website", "Experiment"],
    initialFilters: emptyFilters,
    onFiltersChange: vi.fn(),
  }

  it("renders all category badges", () => {
    renderReact(<SearchFilterBar {...defaultProps} />)
    expect(
      screen.getByRole("button", { name: "Web Application" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Website" })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Experiment" })
    ).toBeInTheDocument()
  })

  it("toggles category on click", async () => {
    const handleFiltersChange = vi.fn()
    const user = setupUser()
    renderReact(
      <SearchFilterBar
        {...defaultProps}
        onFiltersChange={handleFiltersChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "Web Application" }))

    expect(handleFiltersChange).toHaveBeenCalledWith({
      ...emptyFilters,
      categories: ["Web Application"],
    })
  })

  describe("tags combobox", () => {
    it("lists tags in the popover and toggles them", async () => {
      const handleFiltersChange = vi.fn()
      const user = setupUser()
      renderReact(
        <SearchFilterBar
          {...defaultProps}
          onFiltersChange={handleFiltersChange}
        />
      )

      await user.click(screen.getByTestId("tag-filter-trigger"))

      const options = screen.getAllByTestId("tag-filter-option")
      expect(options.map((option) => option.textContent)).toEqual([
        "#react",
        "#astro",
      ])

      await user.click(screen.getByRole("option", { name: "#react" }))

      expect(handleFiltersChange).toHaveBeenCalledWith({
        ...emptyFilters,
        tags: ["react"],
      })
    })

    it("filters tags by search input", async () => {
      const user = setupUser()
      renderReact(<SearchFilterBar {...defaultProps} />)

      await user.click(screen.getByTestId("tag-filter-trigger"))
      await user.type(screen.getByPlaceholderText("Search tags..."), "ast")

      const options = screen.getAllByTestId("tag-filter-option")
      expect(options.map((option) => option.textContent)).toEqual(["#astro"])
    })

    it("shows a count badge for selected tags", () => {
      renderReact(
        <SearchFilterBar
          {...defaultProps}
          initialFilters={{ ...emptyFilters, tags: ["react", "astro"] }}
        />
      )

      expect(screen.getByTestId("tag-filter-trigger")).toHaveTextContent(
        "Tags2"
      )
    })
  })

  describe("sort select", () => {
    it("emits the chosen sort value", async () => {
      const handleFiltersChange = vi.fn()
      const user = setupUser()
      renderReact(
        <SearchFilterBar
          {...defaultProps}
          onFiltersChange={handleFiltersChange}
        />
      )

      await user.click(screen.getByTestId("sort-select"))
      await user.click(screen.getByRole("option", { name: "Oldest first" }))

      expect(handleFiltersChange).toHaveBeenCalledWith({
        ...emptyFilters,
        sort: "date-asc",
      })
    })

    it("emits null when the default sort is chosen", async () => {
      const handleFiltersChange = vi.fn()
      const user = setupUser()
      renderReact(
        <SearchFilterBar
          {...defaultProps}
          initialFilters={{ ...emptyFilters, sort: "title-asc" }}
          onFiltersChange={handleFiltersChange}
        />
      )

      await user.click(screen.getByTestId("sort-select"))
      await user.click(screen.getByRole("option", { name: "Newest first" }))

      expect(handleFiltersChange).toHaveBeenCalledWith({
        ...emptyFilters,
        sort: null,
      })
    })

    it("shows the current sort option on the trigger", () => {
      renderReact(
        <SearchFilterBar
          {...defaultProps}
          initialFilters={{ ...emptyFilters, sort: "title-asc" }}
        />
      )

      expect(screen.getByTestId("sort-select")).toHaveTextContent("Title A–Z")
    })
  })

  describe("date range", () => {
    it("applies a preset range", async () => {
      const handleFiltersChange = vi.fn()
      const user = setupUser()
      renderReact(
        <SearchFilterBar
          {...defaultProps}
          onFiltersChange={handleFiltersChange}
        />
      )

      await user.click(screen.getByTestId("date-filter-trigger"))
      await user.click(screen.getByRole("button", { name: "Last year" }))

      const lastYear = new Date().getFullYear() - 1
      expect(handleFiltersChange).toHaveBeenCalledWith({
        ...emptyFilters,
        from: `${lastYear}-01-01`,
        to: `${lastYear}-12-31`,
      })
    })

    it("clears the range via the All time preset", async () => {
      const handleFiltersChange = vi.fn()
      const user = setupUser()
      renderReact(
        <SearchFilterBar
          {...defaultProps}
          initialFilters={{
            ...emptyFilters,
            from: "2024-01-01",
            to: "2024-12-31",
          }}
          onFiltersChange={handleFiltersChange}
        />
      )

      await user.click(screen.getByTestId("date-filter-trigger"))
      await user.click(screen.getByRole("button", { name: "All time" }))

      expect(handleFiltersChange).toHaveBeenCalledWith(emptyFilters)
    })

    it("shows the active range on the trigger and as a chip", () => {
      renderReact(
        <SearchFilterBar
          {...defaultProps}
          initialFilters={{
            ...emptyFilters,
            from: "2024-01-01",
            to: "2024-12-31",
          }}
        />
      )

      expect(screen.getByTestId("date-filter-trigger")).not.toHaveTextContent(
        "Date range"
      )
      const chips = screen.getAllByTestId("active-filter-chip")
      expect(chips).toHaveLength(1)
    })

    it("removes the date chip and clears both bounds", async () => {
      const handleFiltersChange = vi.fn()
      const user = setupUser()
      renderReact(
        <SearchFilterBar
          {...defaultProps}
          initialFilters={{
            ...emptyFilters,
            from: "2024-01-01",
            to: "2024-12-31",
          }}
          onFiltersChange={handleFiltersChange}
        />
      )

      const chip = screen.getByTestId("active-filter-chip")
      await user.click(
        within(chip).getByRole("button", { name: /Remove filter/ })
      )

      expect(handleFiltersChange).toHaveBeenCalledWith(emptyFilters)
    })
  })

  it("shows active filter chips for selected tags and categories", () => {
    renderReact(
      <SearchFilterBar
        {...defaultProps}
        initialFilters={{
          ...emptyFilters,
          tags: ["react"],
          categories: ["Web Application"],
        }}
      />
    )

    const chips = screen.getAllByTestId("active-filter-chip")
    expect(chips).toHaveLength(2)
    expect(chips[0]).toHaveTextContent("Web Application")
    expect(chips[1]).toHaveTextContent("#react")
  })

  it("hides the active filter row when nothing is selected", () => {
    renderReact(<SearchFilterBar {...defaultProps} />)

    expect(screen.queryByTestId("active-filter-chip")).not.toBeInTheDocument()
    expect(screen.queryByText("Clear all")).not.toBeInTheDocument()
  })

  it("removes a filter via its chip's remove button", async () => {
    const handleFiltersChange = vi.fn()
    const user = setupUser()
    renderReact(
      <SearchFilterBar
        {...defaultProps}
        initialFilters={{
          ...emptyFilters,
          tags: ["react"],
          categories: ["Web Application"],
        }}
        onFiltersChange={handleFiltersChange}
      />
    )

    const chips = screen.getAllByTestId("active-filter-chip")
    const tagChip = chips.find((chip) => chip.textContent?.includes("#react"))!
    await user.click(
      within(tagChip).getByRole("button", { name: /Remove filter/ })
    )

    expect(handleFiltersChange).toHaveBeenCalledWith({
      ...emptyFilters,
      categories: ["Web Application"],
    })
  })

  it("clears all filters when clear button clicked", async () => {
    const handleFiltersChange = vi.fn()
    const user = setupUser()
    renderReact(
      <SearchFilterBar
        {...defaultProps}
        initialFilters={{
          tags: ["react"],
          categories: ["Web Application"],
          sort: "title-desc",
          from: "2024-01-01",
          to: "2024-12-31",
        }}
        onFiltersChange={handleFiltersChange}
      />
    )

    await user.click(screen.getByText("Clear all"))

    expect(handleFiltersChange).toHaveBeenCalledWith(emptyFilters)
  })

  it("does not render category badges when no categories provided", () => {
    renderReact(<SearchFilterBar {...defaultProps} categories={[]} />)

    expect(screen.queryByTestId("category-filter")).not.toBeInTheDocument()
  })

  it("does not render the tag combobox when no tags provided", () => {
    renderReact(<SearchFilterBar {...defaultProps} tags={[]} />)

    expect(screen.queryByTestId("tag-filter-trigger")).not.toBeInTheDocument()
  })
})
