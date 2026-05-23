import { describe, expect, it, vi, beforeEach } from "vitest"
import type { CollectionEntry } from "astro:content"

// Mock astro:content
const mockGetCollection = vi.fn()
vi.mock("astro:content", () => ({
  getCollection: (...args: Parameters<typeof mockGetCollection>) =>
    mockGetCollection(...args),
}))

import { getProfileExperienceByLocale } from "./queries"

function createMockExperienceEntries(
  locale: string,
  count: number
): CollectionEntry<"profileExperience">[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${locale}/experience-${i + 1}`,
    collection: "profileExperience" as const,
    data: {
      id: count - i, // Reverse order to test sorting
      locale: locale as "en" | "es" | "fr",
      company: `Company ${i + 1}`,
      companyLocation: `Location ${i + 1}`,
      role: {
        title: `Role ${i + 1}`,
        start: "2024-01",
        end: i === 0 ? null : "2024-12",
        currentlyWorking: i === 0,
      },
    },
    body: "- Highlight 1\n- Highlight 2",
    rendered: undefined,
    filePath: `src/content/profileExperience/${locale}/experience-${i + 1}.md`,
  })) as CollectionEntry<"profileExperience">[]
}

describe("content queries", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getProfileExperienceByLocale", () => {
    it("returns entries filtered by locale", async () => {
      const enEntries = createMockExperienceEntries("en", 3)
      const esEntries = createMockExperienceEntries("es", 2)

      mockGetCollection.mockResolvedValue([...enEntries, ...esEntries])

      const result = await getProfileExperienceByLocale("en")

      expect(result).toHaveLength(3)
      expect(result.every((entry) => entry.data.locale === "en")).toBe(true)
    })

    it("sorts entries by id in ascending order", async () => {
      const entries = createMockExperienceEntries("en", 3)
      // Entries are created with ids 3, 2, 1 (reverse order)

      mockGetCollection.mockResolvedValue(entries)

      const result = await getProfileExperienceByLocale("en")

      expect(result[0].data.id).toBe(1)
      expect(result[1].data.id).toBe(2)
      expect(result[2].data.id).toBe(3)
    })

    it("returns empty array when no entries match locale", async () => {
      const enEntries = createMockExperienceEntries("en", 2)

      mockGetCollection.mockResolvedValue(enEntries)

      const result = await getProfileExperienceByLocale("fr")

      expect(result).toHaveLength(0)
    })

    it("returns empty array when collection is empty", async () => {
      mockGetCollection.mockResolvedValue([])

      const result = await getProfileExperienceByLocale("en")

      expect(result).toHaveLength(0)
    })

    it("handles entries with multiple roles", async () => {
      const entries = [
        {
          id: "en/company",
          collection: "profileExperience" as const,
          data: {
            id: 1,
            locale: "en" as const,
            company: "Test Company",
            companyLocation: "Remote",
            role: {
              title: "Senior Developer",
              location: "Remote",
              start: "2023-01",
              end: "2023-12",
              currentlyWorking: false,
            },
          },
          body: "- Led a team\n- Shipped features",
          rendered: undefined,
          filePath: "src/content/profileExperience/en/company.md",
        },
        {
          id: "en/company-2",
          collection: "profileExperience" as const,
          data: {
            id: 1,
            locale: "en" as const,
            company: "Test Company",
            companyLocation: "Remote",
            role: {
              title: "Lead Developer",
              start: "2024-01",
              end: null,
              currentlyWorking: true,
            },
          },
          body: "- Architected systems",
          rendered: undefined,
          filePath: "src/content/profileExperience/en/company-2.md",
        },
      ] as CollectionEntry<"profileExperience">[]

      mockGetCollection.mockResolvedValue(entries)

      const result = await getProfileExperienceByLocale("en")

      expect(result).toHaveLength(1)
      expect(result[0].data.roles).toHaveLength(2)
      expect(result[0].data.roles[0].title).toBe("Senior Developer")
      expect(result[0].data.roles[1].title).toBe("Lead Developer")
    })

    it("filters by locale when entries exist for multiple locales", async () => {
      const enEntries = createMockExperienceEntries("en", 2)
      const esEntries = createMockExperienceEntries("es", 3)
      const frEntries = createMockExperienceEntries("fr", 1)

      mockGetCollection.mockResolvedValue([
        ...enEntries,
        ...esEntries,
        ...frEntries,
      ])

      const enResult = await getProfileExperienceByLocale("en")
      const esResult = await getProfileExperienceByLocale("es")
      const frResult = await getProfileExperienceByLocale("fr")

      expect(enResult).toHaveLength(2)
      expect(esResult).toHaveLength(3)
      expect(frResult).toHaveLength(1)
    })
  })
})
