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
import { t } from "@/i18n/ui"

interface BlogCardProps {
  item: SerializedBlogPost
  locale: Locale
}

export function BlogCard({ item, locale }: BlogCardProps) {
  return (
    <a
      href={`/${locale}/blog/${item.slug}`}
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
          {item.category && (
            <Badge variant="default" className="mb-2 w-fit capitalize">
              {item.category}
            </Badge>
          )}
          <CardTitle className="text-lg leading-snug font-medium transition-colors group-hover:text-primary">
            {item.title}
          </CardTitle>
          <div className="mt-2">
            <Badge variant="outline" className="w-fit text-muted-foreground/80">
              {formatShortDate(new Date(item.date), locale)}
            </Badge>
          </div>
          <CardDescription className="mt-3 line-clamp-2">
            {item.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="mt-auto pt-0 pb-4 border-0 bg-transparent">
          <span className="inline-flex items-center text-sm font-medium text-primary">
            {t(locale, "blog.readMore")}
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
