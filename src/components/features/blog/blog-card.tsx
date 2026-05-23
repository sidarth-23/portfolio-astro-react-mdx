"use client"

import { Badge } from "@/components/ui/react"
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/react"
import type { BlogListingItem } from "@/lib/api/listing-api"
import type { Locale } from "@/i18n/config"
import { formatShortDate } from "@/lib/content"
import { createBlogCardView } from "@/components/features/listing/card-presenters"

interface BlogCardProps {
  item: BlogListingItem
  locale: Locale
}

export function BlogCard({ item, locale }: BlogCardProps) {
  const card = createBlogCardView({
    locale,
    slug: item.slug,
    title: item.title,
    category: item.category,
    formattedDate: formatShortDate(new Date(item.date), locale),
    description: item.description,
    tags: item.tags,
    coverImage: {
      src: item.coverImage.src,
      width: item.coverImage.width,
      height: item.coverImage.height,
    },
  })

  return (
    <a href={card.href} className="group block h-full" data-testid="blog-card">
      <Card className="h-full gap-0 p-0 transition-colors hover:shadow-md hover:ring-foreground/20">
        <div className="relative aspect-video w-full overflow-hidden bg-black/5">
          <picture>
            {item.coverImage.srcSet && (
              <source
                srcSet={item.coverImage.srcSet}
                sizes={item.coverImage.sizes}
                type="image/webp"
              />
            )}
            <img
              src={card.coverImage.src}
              alt=""
              aria-hidden="true"
              width={64}
              height={36}
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
            />
          </picture>
          <picture>
            {item.coverImage.srcSet && (
              <source
                srcSet={item.coverImage.srcSet}
                sizes={item.coverImage.sizes}
                type="image/webp"
              />
            )}
            <img
              src={card.coverImage.src}
              alt={card.title}
              width={card.coverImage.width}
              height={card.coverImage.height}
              loading="lazy"
              decoding="async"
              className="relative z-10 h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </picture>
        </div>
        <CardContent className="flex flex-1 flex-col pt-4 pb-0">
          {card.category && (
            <Badge variant="default" className="mb-2 w-fit capitalize">
              {card.category}
            </Badge>
          )}
          <CardTitle className="text-lg leading-snug font-medium">
            {card.title}
          </CardTitle>
          <div className="mt-2">
            <Badge variant="outline" className="w-fit text-muted-foreground/80">
              {card.formattedDate}
            </Badge>
          </div>
          <CardDescription className="mt-3 line-clamp-2 flex-1">
            {card.description}
          </CardDescription>
          {card.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {card.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="mt-auto justify-end border-0 bg-transparent pt-2 pb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </CardFooter>
      </Card>
    </a>
  )
}
