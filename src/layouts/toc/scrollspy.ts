export type HeadingPosition = {
  id: string
  top: number
}

export function getScrollspyOffset(viewportHeight: number): number {
  return Math.max(72, Math.min(140, viewportHeight * 0.2))
}

/**
 * Picks the heading that should be active for a given viewport offset.
 *
 * Rules:
 * 1. Prefer the last heading that has crossed the offset line.
 * 2. If none crossed yet, use the first heading.
 */
export function getActiveHeadingHash(
  headings: HeadingPosition[],
  offset = getScrollspyOffset(900)
): string {
  if (headings.length === 0) return ""

  let activeIndex = 0

  for (let index = 0; index < headings.length; index += 1) {
    if (headings[index].top - offset <= 0) {
      activeIndex = index
    } else {
      break
    }
  }

  return `#${headings[activeIndex].id}`
}
