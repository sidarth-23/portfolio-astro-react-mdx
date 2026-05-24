export type HeadingPosition = {
  id: string
  absoluteTop: number
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
  scrollTop: number,
  offset = getScrollspyOffset(900)
): string {
  if (headings.length === 0) return ""

  let activeIndex = 0
  const activeLine = scrollTop + offset

  for (let index = 0; index < headings.length; index += 1) {
    if (headings[index].absoluteTop <= activeLine) {
      activeIndex = index
    } else {
      break
    }
  }

  return `#${headings[activeIndex].id}`
}

/**
 * Returns headings whose content section overlaps the current viewport window.
 * A section spans from its heading to the next heading.
 */
export function getActiveHeadingIds(
  headings: HeadingPosition[],
  scrollTop: number,
  viewportHeight: number,
  offset = getScrollspyOffset(900)
): string[] {
  if (headings.length === 0) return []

  const topLine = scrollTop + offset
  const bottomLine = scrollTop + Math.max(offset, viewportHeight - offset)
  const activeIds: string[] = []

  for (let index = 0; index < headings.length; index += 1) {
    const start = headings[index].absoluteTop
    const end = headings[index + 1]?.absoluteTop ?? Number.POSITIVE_INFINITY
    const overlapsViewport = end > topLine && start <= bottomLine

    if (overlapsViewport) {
      activeIds.push(headings[index].id)
    }
  }

  if (activeIds.length > 0) return activeIds

  let fallbackIndex = 0
  let minDistance = Number.POSITIVE_INFINITY
  for (let index = 0; index < headings.length; index += 1) {
    const distance = Math.abs(headings[index].absoluteTop - topLine)
    if (distance < minDistance) {
      minDistance = distance
      fallbackIndex = index
    }
  }

  return [headings[fallbackIndex].id]
}
