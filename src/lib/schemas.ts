import { z } from "astro/zod"

export const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case")

export const seoSchema = z.object({
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(160),
})

export const linkSchema = z.object({
  type: z.enum(["github", "link"]),
        url: z.url(),
})

export const tagSchema = z.string().min(1).max(50)

export const dateSchema = z
  .union([z.date(), z.iso.datetime()])
  .transform((val) => (val instanceof Date ? val : new Date(val)))

export const profileSkillIconSchema = z.object({
  source: z.enum(["simple", "huge", "custom"]),
  name: z.string().min(1),
})

const profileMonthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, {
  message: "Expected month in YYYY-MM format",
})

export const profileSchema = z.object({
  locale: z.enum(["en", "es", "fr"]),
  profile: z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    summary: z.string().min(1),
    focus: z.array(z.string().min(1)).min(1),
  }),

  skills: z
    .array(
      z.object({
        title: z.string().min(1),
        items: z
          .array(
            z.object({
              label: z.string().min(1),
              icon: profileSkillIconSchema,
            })
          )
          .min(1),
      })
    )
    .min(1),
  certifications: z
    .array(
      z.object({
        title: z.string().min(1),
  url: z.url(),
      })
    )
    .min(1),
})

const profileExperienceRoleSchema = z
  .object({
    title: z.string().min(1),
    location: z.string().min(1).optional(),
    start: profileMonthSchema,
    end: profileMonthSchema.nullable().optional(),
    currentlyWorking: z.boolean().default(false),
  })
  .refine((item) => item.currentlyWorking || Boolean(item.end), {
    message: "end is required when currentlyWorking is false",
    path: ["end"],
  })

export const profileExperienceSchema = z
  .object({
    id: z.number().int().positive(),
    locale: z.enum(["en", "es", "fr"]),
    company: z.string().min(1),
    companyLocation: z.string().min(1),
    role: profileExperienceRoleSchema,
  })

export const resumeSchema = z.object({
  locale: z.enum(["en", "es", "fr"]).default("en"),
  title: z.string().min(1).default("Resume"),
})
