import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

import type { SearchResult } from "@/lib/search/search"
import { renderReact } from "@/test/utils"

import { GlobalSearch } from "./global-search"

const results: SearchResult[] = [
  {
    id: "blog-hello-world-deployment",
    title: "Hello World",
    sectionTitle: "Deployment",
    url: "/en/blog/hello-world#deployment",
    kind: "section",
    scope: "blog",
    snippet: "We watch metrics and logs during deployment.",
    snippetMatches: [{ start: 33, end: 43 }],
    titleMatches: [],
    sectionTitleMatches: [{ start: 0, end: 10 }],
  },
  {
    id: "profile-overview",
    title: "Profile",
    sectionTitle: "Overview",
    url: "/en/profile#overview",
    kind: "section",
    scope: "profile",
    snippet: "Deployment specialist.",
    snippetMatches: [{ start: 0, end: 10 }],
    titleMatches: [],
    sectionTitleMatches: [],
  },
]

function stubFetch() {
  const fetchMock = vi.fn(
    async () =>
      new Response(JSON.stringify({ results }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
  )
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}

describe("GlobalSearch", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("opens via the trigger button and renders grouped results", async () => {
    const fetchMock = stubFetch()

    renderReact(<GlobalSearch locale="en" />)

    await userEvent.click(screen.getByRole("button", { name: "Search" }))

    const input = screen.getByPlaceholderText(
      "Search posts, profile, sections..."
    )
    await userEvent.type(input, "deployment")

    expect(await screen.findByText("Blog posts")).toBeInTheDocument()
    expect(screen.getByText("Hello World")).toBeInTheDocument()
    expect(
      screen.getByText("Profile", { selector: "[cmdk-group-heading]" })
    ).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      "/en/api/search.json?q=deployment&limit=12",
      expect.any(Object)
    )
  })

  it("highlights matched ranges with mark elements", async () => {
    stubFetch()

    renderReact(<GlobalSearch locale="en" />)

    await userEvent.click(screen.getByRole("button", { name: "Search" }))
    await userEvent.type(
      screen.getByPlaceholderText("Search posts, profile, sections..."),
      "deployment"
    )

    const marks = await screen.findAllByText(/deployment/i, {
      selector: "mark",
    })
    // blog sectionTitle + blog snippet + profile snippet highlights
    expect(marks).toHaveLength(3)
  })

  it("opens with Ctrl+K and closes with Escape", async () => {
    stubFetch()

    renderReact(<GlobalSearch locale="en" />)

    await userEvent.keyboard("{Control>}k{/Control}")
    expect(
      screen.getByPlaceholderText("Search posts, profile, sections...")
    ).toBeInTheDocument()

    await userEvent.keyboard("{Escape}")
    expect(
      screen.queryByPlaceholderText("Search posts, profile, sections...")
    ).not.toBeInTheDocument()
  })

  it("renders localized strings", async () => {
    stubFetch()

    renderReact(<GlobalSearch locale="es" />)

    await userEvent.click(screen.getByRole("button", { name: "Buscar" }))

    expect(
      screen.getByPlaceholderText("Buscar publicaciones, perfil, secciones...")
    ).toBeInTheDocument()
    expect(
      screen.getByText("Escribe al menos 2 caracteres")
    ).toBeInTheDocument()

    await userEvent.type(
      screen.getByPlaceholderText("Buscar publicaciones, perfil, secciones..."),
      "deployment"
    )

    expect(
      await screen.findByText("Publicaciones del blog")
    ).toBeInTheDocument()
  })
})
