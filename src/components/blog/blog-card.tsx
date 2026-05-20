"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import type { SerializedBlogPost } from "@/lib/api-serialization"
import type { Locale } from "@/i18n/config"
import { formatShortDate } from "@/lib/date-formatting"
import { createBlogCardView } from "@/components/shared/card-presenters"

interface BlogCardProps {
  item: SerializedBlogPost
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
    coverImage: item.coverImage,
  })

  return (
    <a href={card.href} className="group block h-full">
      <Card className="p-0 gap-0 h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative overflow-hidden bg-black/5 aspect-video w-full">
          <img
            src={card.coverImage.src}
            alt=""
            aria-hidden="true"
            width={64}
            height={36}
            className="absolute inset-0 h-full w-full object-cover blur-2xl scale-110"
          />
          <img
            src={card.coverImage.src}
            alt={card.title}
            width={card.coverImage.width}
            height={card.coverImage.height}
            loading="lazy"
            decoding="async"
            className="relative z-10 h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="flex flex-1 flex-col pt-4">
          {card.category && (
            <Badge variant="default" className="mb-2 w-fit capitalize">
              {card.category}
            </Badge>
          )}
          <CardTitle className="text-lg leading-snug font-medium transition-colors group-hover:text-primary">
            {card.title}
          </CardTitle>
          <div className="mt-2">
            <Badge variant="outline" className="w-fit text-muted-foreground/80">
              {card.formattedDate}
            </Badge>
          </div>
          <CardDescription className="mt-3 line-clamp-2">
            {card.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="mt-auto pt-0 pb-4 border-0 bg-transparent">
          <span className="inline-flex items-center text-sm font-medium text-primary">
            {card.readMoreLabel}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </span>
        </CardFooter>
      </Card>
    </a>
  )
}
