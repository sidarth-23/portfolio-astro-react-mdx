import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { defineCollection } from "astro:content"

import { locales } from "@/i18n/config"
import {
  seoSchema,
  linkSchema,
  tagSchema,
  dateSchema,
  profileExperienceSchema,
} from "@/lib/schemas"

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(120),
      description: z.string().min(1).max(500),
      date: dateSchema,
      updatedDate: dateSchema.optional(),
      draft: z.boolean().default(false),
      coverImage: image(),
      featured: z.boolean().default(false),
      links: z.array(linkSchema).default([]),
      tags: z.array(tagSchema).default([]),
      category: z.string().min(1).optional(),
      series: z.string().optional(),
      seo: seoSchema,
      locale: z.enum(locales).default("en"),
    }),
})

const profileExperience = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/profile-experience",
  }),
  schema: profileExperienceSchema,
})

export const collections = {
  blog,
  profileExperience,
}
