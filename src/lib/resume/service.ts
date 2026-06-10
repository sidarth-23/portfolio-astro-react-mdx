import { getCollection } from "astro:content"
import { createMarkdownProcessor } from "@astrojs/markdown-remark"

export async function getResumeContent() {
  const entries = await getCollection(
    "resume",
    ({ data }) => data.locale === "en"
  )
  const entry = entries[0]
  if (!entry) {
    throw new Error("Resume content is missing. Add src/content/resume/en.md.")
  }

  const rawMarkdown = (entry.body ?? "").trim()
  const markdown = rawMarkdown

  const processor = await createMarkdownProcessor()
  const html = (await processor.render(markdown)).code

  return { markdown, html }
}
