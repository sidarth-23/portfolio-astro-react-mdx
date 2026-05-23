import { describe, expect, it } from "vitest"
import { renderReact } from "@/test/utils"
import { ImageGalleryCarousel } from "./image-gallery-carousel"

describe("ImageGalleryCarousel", () => {
  it("renders a blurred backdrop image layer for each gallery item", () => {
    const { container, getByRole } = renderReact(
      <ImageGalleryCarousel
        images={[
          {
            src: "/_astro/main-1200.webp",
            blurSrc: "/_astro/blur-64.webp",
            alt: "Bluebook dashboard preview",
            width: 1200,
            height: 800,
          },
        ]}
      />
    )

    const blurImage = container.querySelector("img[aria-hidden='true']")
    expect(blurImage).toBeInTheDocument()
    expect(blurImage).toHaveClass("blur-2xl", "scale-110")
    expect(getByRole("img", { name: "Bluebook dashboard preview" })).toBeInTheDocument()
  })
})
