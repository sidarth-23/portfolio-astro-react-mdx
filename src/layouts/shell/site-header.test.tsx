import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { renderReact } from "@/test/utils"

import { Breadcrumbs } from "./site-header"

describe("Breadcrumbs", () => {
  it("renders first breadcrumb as ellipsis on mobile for deep paths", () => {
    const { container } = renderReact(
      <Breadcrumbs
        currentPath="/en/blog/guides/authentication"
        pageTitle="Stop Trusting the Client"
      />
    )

    const homeLink = screen.getByRole("link", { name: "Home" })
    expect(homeLink.closest('[data-slot="breadcrumb-item"]')).toHaveClass(
      "hidden",
      "sm:inline-flex"
    )

    const ellipsis = container.querySelectorAll(
      '[data-slot="breadcrumb-ellipsis"]'
    )
    expect(ellipsis).toHaveLength(1)
    const nav = container.querySelector('[data-slot="breadcrumb"]')
    expect(nav).toHaveClass("min-w-0", "overflow-hidden")

    const currentPage = screen.getByRole("link", {
      name: "Stop Trusting the Client",
    })
    expect(currentPage).toHaveClass("block", "max-w-full", "truncate")
    expect(currentPage.closest('[data-slot="breadcrumb-item"]')).toHaveClass(
      "min-w-0",
      "max-w-full"
    )
    expect(
      screen.getByRole("link", { name: "Stop Trusting the Client" })
    ).toBeInTheDocument()
  })

  it("shows the single parent segment directly instead of collapsing it", () => {
    const { container } = renderReact(
      <Breadcrumbs
        currentPath="/en/blog/the-beautiful-overengineered-portfolio-i-walked-away-from"
        pageTitle="The Beautiful, Over-Engineered Portfolio I Walked Away From"
      />
    )

    expect(
      container.querySelectorAll('[data-slot="breadcrumb-ellipsis"]')
    ).toHaveLength(0)
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/en/blog"
    )
    expect(
      screen.getByRole("link", {
        name: "The Beautiful, Over-Engineered Portfolio I Walked Away From",
      })
    ).toBeInTheDocument()
  })
})
