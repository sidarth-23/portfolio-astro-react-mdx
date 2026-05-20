"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import type { SerializedProject } from "@/lib/api-serialization"
import type { Locale } from "@/i18n/config"
import { formatShortDate } from "@/lib/date-formatting"
import { createProjectCardView } from "@/components/shared/card-presenters"

interface ProjectCardProps {
  item: SerializedProject
  locale: Locale
}

export function ProjectCard({ item, locale }: ProjectCardProps) {
  const card = createProjectCardView({
    locale,
    slug: item.slug,
    title: item.title,
    featured: item.featured,
    formattedDate: formatShortDate(new Date(item.date), locale),
    summary: item.summary,
    tags: item.tags,
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
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-snug font-medium transition-colors group-hover:text-primary">
              {card.title}
            </CardTitle>
            {card.featured && (
              <Badge variant="secondary" className="shrink-0">
                {card.featuredLabel}
              </Badge>
            )}
          </div>
          <div className="mt-1">
            <Badge variant="outline" className="w-fit text-muted-foreground/80">
              {card.formattedDate}
            </Badge>
          </div>
          <CardDescription className="mt-3 line-clamp-2 flex-1">
            {card.summary}
          </CardDescription>
          {card.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {card.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  )
}
