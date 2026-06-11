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
      buildContentOgFilename(
        "blog",
        "fr",
        "bonjour-le-monde/with spaces & symbols"
      )
    ).toBe("og-blog-fr-bonjour-le-monde-with-spaces-symbols.png")
  })
})
