import { describe, expect, it, vi } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "./button"
import { renderReact } from "@/test/utils"

describe("Button", () => {
  it("renders default variant", () => {
    renderReact(<Button>Click me</Button>)
    const button = screen.getByRole("button", { name: "Click me" })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute("data-variant", "default")
  })

  it("renders outline variant", () => {
    renderReact(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole("button", { name: "Outline" })
    expect(button).toHaveAttribute("data-variant", "outline")
  })

  it("renders different sizes", () => {
    renderReact(<Button size="sm">Small</Button>)
    const button = screen.getByRole("button", { name: "Small" })
    expect(button).toHaveAttribute("data-size", "sm")
  })

  it("handles click events", async () => {
    const handleClick = vi.fn()
    renderReact(<Button onClick={handleClick}>Click</Button>)
    const button = screen.getByRole("button", { name: "Click" })
    await userEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("is disabled when disabled prop is set", () => {
    renderReact(<Button disabled>Disabled</Button>)
    const button = screen.getByRole("button", { name: "Disabled" })
    expect(button).toBeDisabled()
  })

  it("renders as child when asChild is true", () => {
    renderReact(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    const link = screen.getByRole("link", { name: "Link Button" })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/test")
  })
})
