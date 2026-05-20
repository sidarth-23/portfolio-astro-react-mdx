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
import { t } from "@/i18n/ui"

interface ProjectCardProps {
  item: SerializedProject
  locale: Locale
}

export function ProjectCard({ item, locale }: ProjectCardProps) {
  return (
    <a
      href={`/${locale}/projects/${item.slug}`}
      className="group block h-full"
    >
      <Card className="p-0 gap-0 h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative overflow-hidden bg-black/5 aspect-video w-full">
          <img
            src={item.coverImage.src}
            alt=""
            aria-hidden="true"
            width={64}
            height={36}
            className="absolute inset-0 h-full w-full object-cover blur-2xl scale-110"
          />
          <img
            src={item.coverImage.src}
            alt={item.title}
            width={item.coverImage.width}
            height={item.coverImage.height}
            loading="lazy"
            decoding="async"
            className="relative z-10 h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="flex flex-1 flex-col pt-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-snug font-medium transition-colors group-hover:text-primary">
              {item.title}
            </CardTitle>
            {item.featured && (
              <Badge variant="secondary" className="shrink-0">
                {t(locale, "projects.featuredLabel")}
              </Badge>
            )}
          </div>
          <div className="mt-1">
            <Badge variant="outline" className="w-fit text-muted-foreground/80">
              {formatShortDate(new Date(item.date), locale)}
            </Badge>
          </div>
          <CardDescription className="mt-3 line-clamp-2 flex-1">
            {item.summary}
          </CardDescription>
          {item.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
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
