import { getActiveHeadingIds, type HeadingPosition } from "./scrollspy"

type CleanupFn = () => void

let cleanup: CleanupFn | null = null
const ACTIVE_TEXT = ["border-border", "text-foreground"]
const INACTIVE_TEXT = ["border-border/35", "text-muted-foreground/80"]

function scrollActiveLinkIntoView(link: HTMLAnchorElement, instant = false): void {
  const container = link.closest<HTMLElement>("[data-toc-scroll-container]")
  if (!container) return

  const containerRect = container.getBoundingClientRect()
  const linkRect = link.getBoundingClientRect()
  const containerCenter = containerRect.top + containerRect.height / 2
  const linkCenter = linkRect.top + linkRect.height / 2
  const nextTop = container.scrollTop + (linkCenter - containerCenter)

  container.scrollTo({
    top: nextTop,
    behavior: instant ? "auto" : "smooth",
  })
}

function collectHeadingPositions(headings: HTMLElement[]): HeadingPosition[] {
  return headings.map((heading) => ({
    id: heading.id,
    absoluteTop: heading.getBoundingClientRect().top + window.scrollY,
  }))
}

function computeActiveIds(headings: HeadingPosition[], scrollTop: number, viewportHeight: number): string[] {
  return getActiveHeadingIds(headings, scrollTop, viewportHeight)
}

function applyLinkStates(
  links: HTMLAnchorElement[],
  activeSet: Set<string>,
  latestActiveId: string,
  shouldAutoScroll: boolean
): void {
  for (const link of links) {
    const href = link.getAttribute("href")
    const id = href?.startsWith("#") ? href.slice(1) : ""
    const isActive = Boolean(id && activeSet.has(id))

    if (isActive) {
      link.classList.add(...ACTIVE_TEXT)
      link.classList.remove(...INACTIVE_TEXT)
    } else {
      link.classList.remove(...ACTIVE_TEXT)
      link.classList.add(...INACTIVE_TEXT)
    }
  }

  if (!shouldAutoScroll || !latestActiveId) return

  const activeLink = links.find((link) => link.getAttribute("href") === `#${latestActiveId}`)
  if (activeLink) {
    scrollActiveLinkIntoView(activeLink)
  }
}

function applyMobileSummaryAndProgress(
  firstActiveId: string,
  latestActiveId: string,
  headingIds: string[],
  headingMap: Map<string, number>,
  mobileLinksByHash: Map<string, HTMLAnchorElement>,
  mobileSummary: HTMLElement | null,
  mobileProgress: SVGCircleElement | null,
  mobileProgressTrackLength: number
): void {
  if (mobileSummary && firstActiveId) {
    const matchingLink = mobileLinksByHash.get(`#${firstActiveId}`)
    if (matchingLink) {
      mobileSummary.textContent = matchingLink.textContent?.trim() ?? ""
    }
  }

  if (mobileProgress && mobileProgressTrackLength > 0 && latestActiveId) {
    const activeEndIndex = headingMap.get(latestActiveId) ?? -1
    const progress = (activeEndIndex + 1) / Math.max(1, headingIds.length)
    mobileProgress.style.strokeDashoffset = `${mobileProgressTrackLength * (1 - progress)}`
  }
}

function initTocScrollspy(): void {
  cleanup?.()
  cleanup = null

  const headings = Array.from(
    document.querySelectorAll<HTMLElement>("article h2[id], article h3[id]")
  )
  if (headings.length === 0) return

  const desktopRoot = document.querySelector('[data-toc="desktop"]')
  const mobileRoot = document.querySelector('[data-toc="mobile"]')
  const desktopLinks = Array.from(
    desktopRoot?.querySelectorAll<HTMLAnchorElement>("[data-toc-link]") ?? []
  )
  const mobileLinks = Array.from(
    mobileRoot?.querySelectorAll<HTMLAnchorElement>("[data-toc-link]") ?? []
  )
  const tocLinks = [...desktopLinks, ...mobileLinks]
  if (tocLinks.length === 0) return

  const mobileSummary = document.querySelector<HTMLElement>("[data-toc-summary]")
  const mobileToc = mobileRoot instanceof HTMLDetailsElement ? mobileRoot : null
  const mobileProgress = document.querySelector<SVGCircleElement>("[data-toc-progress-value]")
  const mobileProgressTrackLength = Number(mobileProgress?.dataset.circumference ?? "0")
  const headingIds = headings.map((heading) => heading.id)
  const headingMap = new Map(headingIds.map((id, index) => [id, index]))
  const mobileLinksByHash = new Map(mobileLinks.map((link) => [link.getAttribute("href") ?? "", link]))
  let currentActiveIdsKey = ""
  let rafId = 0

  const sync = (): void => {
    rafId = 0

    const positions = collectHeadingPositions(headings)
    const activeIds = computeActiveIds(positions, window.scrollY, window.innerHeight)
    const activeIdsKey = activeIds.join("|")
    if (activeIdsKey === currentActiveIdsKey) return
    currentActiveIdsKey = activeIdsKey

    const activeSet = new Set(activeIds)
    const latestActiveId = activeIds.at(-1) ?? ""
    const firstActiveId = activeIds[0] ?? ""

    applyLinkStates(desktopLinks, activeSet, latestActiveId, true)
    applyLinkStates(mobileLinks, activeSet, latestActiveId, Boolean(mobileToc?.open))

    applyMobileSummaryAndProgress(
      firstActiveId,
      latestActiveId,
      headingIds,
      headingMap,
      mobileLinksByHash,
      mobileSummary,
      mobileProgress,
      mobileProgressTrackLength
    )
  }

  const requestSync = (): void => {
    if (rafId) return
    rafId = window.requestAnimationFrame(sync)
  }

  const io = new IntersectionObserver(() => {
    requestSync()
  }, {
    root: null,
    threshold: [0, 0.25, 0.5, 0.75, 1],
  })

  for (const heading of headings) {
    io.observe(heading)
  }

  const scrollHandler = (): void => requestSync()
  const resizeHandler = (): void => requestSync()
  const visibilityHandler = (): void => {
    if (document.visibilityState === "visible") {
      requestSync()
    }
  }

  window.addEventListener("scroll", scrollHandler, { passive: true })
  window.addEventListener("resize", resizeHandler)
  window.addEventListener("orientationchange", resizeHandler)
  document.addEventListener("visibilitychange", visibilityHandler)

  const visualViewport = window.visualViewport
  visualViewport?.addEventListener("scroll", scrollHandler, { passive: true })
  visualViewport?.addEventListener("resize", resizeHandler)

  const clickHandlers = new Map<HTMLAnchorElement, EventListener>()
  for (const link of tocLinks) {
    const handler: EventListener = (event) => {
      event.preventDefault()
      const hash = link.getAttribute("href")
      if (!hash) return

      const target = document.querySelector<HTMLElement>(hash)
      if (!target) return

      target.scrollIntoView({ behavior: "smooth" })
      if (history.replaceState) {
        history.replaceState(null, "", hash)
      }

      if (mobileToc) {
        mobileToc.open = false
      }
    }

    clickHandlers.set(link, handler)
    link.addEventListener("click", handler)
  }

  requestSync()

  cleanup = () => {
    io.disconnect()

    if (rafId) {
      window.cancelAnimationFrame(rafId)
      rafId = 0
    }

    window.removeEventListener("scroll", scrollHandler)
    window.removeEventListener("resize", resizeHandler)
    window.removeEventListener("orientationchange", resizeHandler)
    document.removeEventListener("visibilitychange", visibilityHandler)

    visualViewport?.removeEventListener("scroll", scrollHandler)
    visualViewport?.removeEventListener("resize", resizeHandler)

    for (const [link, handler] of clickHandlers) {
      link.removeEventListener("click", handler)
    }
  }
}

export function mountTocScrollspy(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTocScrollspy, { once: true })
  } else {
    initTocScrollspy()
  }

  document.addEventListener("astro:page-load", initTocScrollspy)
}
