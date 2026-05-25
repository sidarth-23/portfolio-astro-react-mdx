import { describe, expect, it, vi } from "vitest"

const markdownFixture = `# Sidarth G

**Title:** Full-Stack Developer
**Contact:** +91-80982-30245 | g.sidarth23@gmail.com
**Links:** linkedin.com/in/sidarth-g | github.com/sidarth-23 | www.sidshub.in

## Work History

### Truvanta
**Period:** 09/2025 - Current | **Role:** Full Stack Developer | **Location:** Chennai, Tamil Nadu
`

vi.mock("astro:content", () => ({
  getCollection: vi.fn(async () => [
    {
      body: markdownFixture,
      data: { locale: "en" },
    },
  ]),
}))

vi.mock("@astrojs/markdown-remark", () => ({
  createMarkdownProcessor: vi.fn(async () => ({
    render: async (input: string) => ({ code: `<article>${input}</article>` }),
  })),
}))

describe("getResumeContent", () => {
  it("preserves full markdown and renders html", async () => {
    const { getResumeContent } = await import("./service")
    const result = await getResumeContent()

    expect(result.markdown).toContain("# Sidarth G")
    expect(result.markdown).toContain("**Title:**")
    expect(result.markdown).toContain("## Work History")
    expect(result.html).toContain("<article>")
  })
})
