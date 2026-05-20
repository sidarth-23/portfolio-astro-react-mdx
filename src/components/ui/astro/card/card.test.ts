import { describe, expect, it } from "vitest"
import Card from "./card.astro"
import { renderAstro } from "@/test/utils"

describe("Card", () => {
  it("renders with default size", async () => {
    const html = await renderAstro(Card)
    expect(html).toContain('data-slot="card"')
    expect(html).toContain('data-size="default"')
  })

  it("renders with sm size", async () => {
    const html = await renderAstro(Card, { size: "sm" })
    expect(html).toContain('data-size="sm"')
  })

  it("renders slot content", async () => {
    const html = await renderAstro(Card, {}, { default: "Hello World" })
    expect(html).toContain("Hello World")
  })

  it("applies custom class", async () => {
    const html = await renderAstro(Card, { class: "my-custom-class" })
    expect(html).toContain("my-custom-class")
  })
})
