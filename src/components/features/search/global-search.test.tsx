import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

import { renderReact } from "@/test/utils"

import { GlobalSearch } from "./global-search"

describe("GlobalSearch", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("opens the search sheet and renders remote results", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              results: [
                {
                  id: "blog-hello-world-deployment",
                  title: "Hello World",
                  sectionTitle: "Deployment",
                  url: "/en/blog/hello-world#deployment",
                  snippet: "We watch metrics and logs during deployment.",
                  kind: "section",
                },
              ],
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          )
      )
    )

    renderReact(<GlobalSearch locale="en" />)

    await userEvent.click(screen.getByRole("button", { name: "Search site" }))

    const input = screen.getByPlaceholderText("Search content")
    await userEvent.type(input, "deployment")

    expect(await screen.findByText("Deployment")).toBeInTheDocument()
    expect(await screen.findByText("Hello World")).toBeInTheDocument()
    expect(
      await screen.findByText("We watch metrics and logs during deployment.")
    ).toBeInTheDocument()
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      "/en/api/search.json?q=deployment",
      expect.any(Object)
    )
  })
})
