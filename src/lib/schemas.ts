import { z } from "zod"

export const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case")

export const seoSchema = z.object({
  title: z.string().min(1).max(70).optional(),
  description: z.string().min(1).max(160).optional(),
  image: z.string().optional(),
})

export const linkSchema = z.object({
  type: z.enum(["github", "link"]),
  url: z.string().url(),
})

export const tagSchema = z.string().min(1).max(50)

export const dateSchema = z
  .union([z.date(), z.string().datetime()])
  .transform((val) => (val instanceof Date ? val : new Date(val)))
