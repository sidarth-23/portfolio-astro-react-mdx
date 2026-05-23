import { describe, expect, it } from "vitest"
import { renderReact } from "@/test/utils"
import { ProjectCard } from "./project-card"

describe("ProjectCard", () => {
  it("renders one responsive image element for the card image", () => {
    const { container, getByRole } = renderReact(
      <ProjectCard
        locale="en"
        item={{
          slug: "my-project",
          title: "My Project",
          summary: "Summary",
          date: "2026-05-01T00:00:00.000Z",
          featured: false,
          status: "active",
          tags: ["astro"],
          coverImage: {
            src: "/_astro/cover-600.webp",
            srcSet:
              "/_astro/cover-400.webp 400w, /_astro/cover-600.webp 600w, /_astro/cover-1200.webp 1200w",
            sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
            width: 600,
            height: 340,
            alt: "My Project",
          },
        }}
      />
    )

    expect(container.querySelectorAll("img")).toHaveLength(2)
    expect(container.querySelectorAll("picture source[type='image/webp']")).toHaveLength(2)
    const blurImage = container.querySelector("img[aria-hidden='true']")
    expect(blurImage).toBeInTheDocument()
    expect(blurImage).toHaveClass("blur-2xl", "scale-110")
    const coverImage = getByRole("img", { name: "My Project" })
    expect(coverImage).toBeInTheDocument()
    expect(coverImage).not.toHaveClass("group-hover:scale-105")
  })
})
