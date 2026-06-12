import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { renderReact } from "@/test/utils"

import { Kbd, KbdGroup } from "./index"

describe("Kbd", () => {
  it("renders keyboard key styling", () => {
    renderReact(<Kbd>Ctrl</Kbd>)

    const kbd = screen.getByText("Ctrl")
    expect(kbd).toHaveAttribute("data-slot", "kbd")
    expect(kbd.tagName).toBe("KBD")
  })

  it("renders grouped keys in a div", () => {
    renderReact(
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    )

    const group = screen.getByText("⌘").parentElement as HTMLElement
    expect(group).toHaveAttribute("data-slot", "kbd-group")
    expect(group.tagName).toBe("DIV")
  })
})
