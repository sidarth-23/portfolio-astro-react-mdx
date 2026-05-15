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

export const cvSkillIconSchema = z.object({
  source: z.enum(["simple", "huge", "custom"]),
  name: z.string().min(1),
})

export const cvSchema = z.object({
  locale: z.enum(["en", "es", "fr"]),
  profile: z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    summary: z.string().min(1),
    focus: z.array(z.string().min(1)).min(1),
  }),
  experience: z
    .array(
      z.object({
        id: z.number().int().positive(),
        role: z.string().min(1),
        company: z.string().min(1),
        location: z.string().min(1),
        period: z.string().min(1),
        highlights: z.array(z.string().min(1)).min(1),
      })
    )
    .min(1),
  skills: z
    .array(
      z.object({
        title: z.string().min(1),
        items: z
          .array(
            z.object({
              label: z.string().min(1),
              icon: cvSkillIconSchema,
            })
          )
          .min(1),
      })
    )
    .min(1),
  certifications: z.array(z.string().min(1)).min(1),
})
