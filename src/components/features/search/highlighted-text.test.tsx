import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { HighlightedText } from "./highlighted-text"

describe("HighlightedText", () => {
  it("renders plain text when there are no matches", () => {
    render(<HighlightedText text="hello world" matches={[]} />)
    expect(screen.getByText("hello world")).toBeInTheDocument()
  })

  it("wraps matched ranges in mark elements", () => {
    render(
      <HighlightedText text="deploy the app" matches={[{ start: 0, end: 6 }]} />
    )

    const mark = screen.getByText("deploy", { selector: "mark" })
    expect(mark).toBeInTheDocument()
  })

  it("renders multiple disjoint matches", () => {
    const { container } = render(
      <HighlightedText
        text="deploy and redeploy deploys"
        matches={[
          { start: 0, end: 6 },
          { start: 20, end: 27 },
        ]}
      />
    )

    expect(container.querySelectorAll("mark")).toHaveLength(2)
    expect(container.textContent).toBe("deploy and redeploy deploys")
  })

  it("ignores malformed ranges", () => {
    const { container } = render(
      <HighlightedText
        text="short"
        matches={[
          { start: 3, end: 2 },
          { start: 2, end: 99 },
        ]}
      />
    )

    expect(container.querySelectorAll("mark")).toHaveLength(0)
    expect(container.textContent).toBe("short")
  })
})
