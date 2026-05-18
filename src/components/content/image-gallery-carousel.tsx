import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel.types"

type GalleryImage = {
  src: string
  alt: string
}

interface ImageGalleryCarouselProps {
  images: GalleryImage[]
}

export function ImageGalleryCarousel({ images }: ImageGalleryCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  if (images.length === 0) return null

  return (
    <section className="mb-10 w-full md:mx-auto md:w-3/4">
      <Carousel
        setApi={setApi}
        opts={{ loop: images.length > 1 }}
        className="relative"
        aria-label="Image gallery"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={`${image.src}-${index}`}>
              <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
                <div className="aspect-4/3 w-full">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="pointer-events-none absolute right-3 bottom-3 rounded-full border border-white/25 bg-black/35 px-3 py-1 text-xs text-white backdrop-blur-md">
          {current + 1} / {images.length}
        </div>

        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2 md:-left-12" />
            <CarouselNext className="right-2 md:-right-12" />
          </>
        )}
      </Carousel>
    </section>
  )
}
