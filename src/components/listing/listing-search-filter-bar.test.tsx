import { describe, expect, it, vi } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SearchFilterBar } from "./listing-search-filter-bar"
import { renderReact } from "@/test/utils"

describe("SearchFilterBar", () => {
  const defaultProps = {
    locale: "en" as const,
    tags: ["react", "astro"],
    categories: ["Web Application", "Website", "Experiment"],
    initialSearch: "",
    initialTags: [],
    initialCategories: [],
    initialSortBy: null,
    onFiltersChange: vi.fn(),
  }

  it("renders category label", () => {
    renderReact(<SearchFilterBar {...defaultProps} />)
    expect(screen.getByText("Categories")).toBeInTheDocument()
  })

  it("renders all category badges", () => {
    renderReact(<SearchFilterBar {...defaultProps} />)
    expect(screen.getByRole("button", { name: "Web Application" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Website" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Experiment" })).toBeInTheDocument()
  })

  it("toggles category on click", async () => {
    const handleFiltersChange = vi.fn()
    renderReact(
      <SearchFilterBar
        {...defaultProps}
        onFiltersChange={handleFiltersChange}
      />
    )

    const categoryButton = screen.getByRole("button", { name: "Web Application" })
    await userEvent.click(categoryButton)

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 400))

    expect(handleFiltersChange).toHaveBeenCalledWith(
      "",
      [],
      ["Web Application"],
      null
    )
  })

  it("shows clear filters when category is active", async () => {
    renderReact(
      <SearchFilterBar
        {...defaultProps}
        initialCategories={["Web Application"]}
      />
    )

    expect(screen.getByText("Clear filters")).toBeInTheDocument()
  })

  it("hides clear filters when no filters active", () => {
    renderReact(<SearchFilterBar {...defaultProps} />)

    expect(screen.queryByText("Clear filters")).not.toBeInTheDocument()
  })

  it("clears all filters when clear button clicked", async () => {
    const handleFiltersChange = vi.fn()
    renderReact(
      <SearchFilterBar
        {...defaultProps}
        initialCategories={["Web Application"]}
        onFiltersChange={handleFiltersChange}
      />
    )

    const clearButton = screen.getByText("Clear filters")
    await userEvent.click(clearButton)

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 400))

    expect(handleFiltersChange).toHaveBeenCalledWith("", [], [], null)
  })

  it("does not render category section when no categories provided", () => {
    renderReact(<SearchFilterBar {...defaultProps} categories={[]} />)

    expect(screen.queryByText("Categories")).not.toBeInTheDocument()
  })
})
