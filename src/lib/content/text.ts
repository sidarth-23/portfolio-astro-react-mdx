export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

export function stripMarkdownToText(markdown: string): string {
  const withoutCodeBlocks = markdown.replace(/```[\s\S]*?```/g, "")
  const withoutInlineCode = withoutCodeBlocks.replace(/`[^`]*`/g, "")
  const withoutHtml = withoutInlineCode.replace(/<[^>]*>/g, "")
  const withoutMarkdown = withoutHtml
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_]{1,2}/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/\|/g, " ")

  return normalizeWhitespace(withoutMarkdown)
}
