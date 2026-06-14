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

const profileSkillGroupSchema = z.object({
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

const profileCertificationSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
})

// Frontmatter for the single-MDX profile biopic. The narrative lives in the
// body; this carries the header metadata + the reference-style skills/certs.
export const profileFrontmatterSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  tagline: z.string().min(1),
  focus: z.array(z.string().min(1)).min(1),
  skills: z.array(profileSkillGroupSchema).min(1),
  certifications: z.array(profileCertificationSchema).min(1),
})
