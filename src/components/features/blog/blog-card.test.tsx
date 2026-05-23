import { describe, expect, it } from "vitest"
import { renderReact } from "@/test/utils"
import { BlogCard } from "./blog-card"

describe("BlogCard", () => {
  it("renders one responsive image element for the card image", () => {
    const { container, getByRole } = renderReact(
      <BlogCard
        locale="en"
        item={{
          slug: "my-post",
          title: "My Post",
          description: "Description",
          date: "2026-05-01T00:00:00.000Z",
          tags: ["astro"],
          coverImage: {
            src: "/_astro/cover-600.webp",
            srcSet:
              "/_astro/cover-400.webp 400w, /_astro/cover-600.webp 600w, /_astro/cover-1200.webp 1200w",
            sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
            width: 600,
            height: 340,
            alt: "My Post",
          },
        }}
      />
    )

    expect(container.querySelectorAll("img")).toHaveLength(2)
    expect(container.querySelectorAll("picture source[type='image/webp']")).toHaveLength(2)
    expect(container.querySelector("img[aria-hidden='true']")).toBeInTheDocument()
    expect(getByRole("img", { name: "My Post" })).toBeInTheDocument()
  })
})
