import { describe, expect, it } from "vitest"
import { buildContentOgFilename } from "./content-og"

describe("buildContentOgFilename", () => {
  it("creates stable filenames from nested slugs", () => {
    expect(buildContentOgFilename("blog", "en", "deep/nested/path")).toBe(
      "og-blog-en-deep-nested-path.png"
    )
  })

  it("normalizes non-alphanumeric characters", () => {
    expect(
      buildContentOgFilename("projects", "fr", "bonjour-le-monde/with spaces & symbols")
    ).toBe("og-projects-fr-bonjour-le-monde-with-spaces-symbols.png")
  })
})
