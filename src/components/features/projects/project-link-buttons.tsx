import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { GitHubIcon } from "@/components/icon"
import type { linkSchema } from "@/lib/schemas"

import type { z } from "astro/zod"

type Link = z.infer<typeof linkSchema>

export function ProjectLinkButtons({ links }: { links: Link[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          title={link.type === "github" ? "GitHub" : "External link"}
        >
          {link.type === "github" ? (
            <GitHubIcon className="size-4" />
          ) : (
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              size={16}
              strokeWidth={2}
            />
          )}
          <span className="text-xs text-muted-foreground">
            {link.type === "github" ? "GitHub" : "Live"}
          </span>
        </a>
      ))}
    </div>
  )
}
