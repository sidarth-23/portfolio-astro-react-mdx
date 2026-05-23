import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"
import {
  seoSchema,
  linkSchema,
  tagSchema,
  dateSchema,
  profileSchema,
  profileExperienceSchema,
} from "@/lib/schemas"
import { locales } from "@/i18n/config"

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
      tags: z.array(tagSchema).default([]),
      category: z.string().min(1).optional(),
      series: z.string().optional(),
      seo: seoSchema.optional(),
      locale: z.enum(locales).default("en"),
    }),
})

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
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

const profile = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/profile" }),
  schema: profileSchema,
})

const profileExperience = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/profileExperience" }),
  schema: profileExperienceSchema,
})

export const collections = {
  blog,
  projects,
  profile,
  profileExperience,
}
