import type { MatchRange } from "@/lib/search/snippet"

interface HighlightedTextProps {
  text: string
  matches: MatchRange[]
}

export function HighlightedText({ text, matches }: HighlightedTextProps) {
  if (matches.length === 0) return <>{text}</>

  const parts: React.ReactNode[] = []
  let cursor = 0

  for (const { start, end } of matches) {
    if (start < cursor || start >= end || end > text.length) continue

    if (start > cursor) {
      parts.push(text.slice(cursor, start))
    }
    parts.push(
      <mark key={start} className="bg-transparent font-medium text-primary">
        {text.slice(start, end)}
      </mark>
    )
    cursor = end
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor))
  }

  return <>{parts}</>
}
