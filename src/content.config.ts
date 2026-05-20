import { defineCollection } from "astro:content"
import { z } from "zod"
import {
  seoSchema,
  linkSchema,
  tagSchema,
  dateSchema,
  cvSchema,
  cvExperienceSchema,
} from "@/lib/schemas"
import { locales } from "@/i18n/config"

const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(120),
      description: z.string().min(1).max(500),
      date: dateSchema,
      updatedDate: dateSchema.optional(),
      draft: z.boolean().default(false),
      coverImage: image(),
      tags: z.array(tagSchema).default([]),
      category: z.string().min(1).optional(),
      series: z.string().optional(),
      seo: seoSchema.optional(),
      locale: z.enum(locales).default("en"),
    }),
})

const projects = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(120),
      summary: z.string().min(1).max(500),
      date: dateSchema,
      updatedDate: dateSchema.optional(),
      coverImage: image(),
      featured: z.boolean().default(false),
      status: z.enum(["active", "archived", "concept"]).default("active"),
      links: z.array(linkSchema).default([]),
      tags: z.array(tagSchema).default([]),
      category: z.string().min(1),
      seo: seoSchema.optional(),
      locale: z.enum(locales).default("en"),
    }),
})

const cv = defineCollection({
  type: "data",
  schema: cvSchema,
})

const cvExperience = defineCollection({
  type: "content",
  schema: cvExperienceSchema,
})

export const collections = {
  blog,
  projects,
  cv,
  cvExperience,
}
