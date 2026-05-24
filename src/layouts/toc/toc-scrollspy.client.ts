import { getActiveHeadingIds, getScrollspyOffset } from "./scrollspy"

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

function initTocScrollspy(): void {
  cleanup?.()
  cleanup = null

  const headings = Array.from(
    document.querySelectorAll<HTMLElement>("article h2[id], article h3[id]")
  )
  if (headings.length === 0) return

  const tocLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]")
  )
  if (tocLinks.length === 0) return

  const mobileSummary = document.querySelector<HTMLElement>("[data-toc-summary]")
  const mobileToc = document.querySelector('[data-toc="mobile"]')
  const mobileProgress = document.querySelector<SVGCircleElement>("[data-toc-progress-value]")
  const mobileProgressTrackLength = Number(mobileProgress?.dataset.circumference ?? "0")
  const scrollRoot = document.scrollingElement as HTMLElement | null
  const headingIds = headings.map((heading) => heading.id)
  const headingMap = new Map(headingIds.map((id, index) => [id, index]))
  const linksByHash = new Map(tocLinks.map((link) => [link.getAttribute("href") ?? "", link]))
  let currentActiveIdsKey = ""
  let ticking = false

  const setLinkActiveState = (link: HTMLAnchorElement, active: boolean): void => {
    if (active) {
      link.classList.add(...ACTIVE_TEXT)
      link.classList.remove(...INACTIVE_TEXT)
      return
    }
    link.classList.remove(...ACTIVE_TEXT)
    link.classList.add(...INACTIVE_TEXT)
  }

  const applyActiveState = (activeIds: string[]): void => {
    const activeIdsKey = activeIds.join("|")
    if (activeIdsKey === currentActiveIdsKey) return
    currentActiveIdsKey = activeIdsKey

    const activeSet = new Set(activeIds)
    const latestActiveId = activeIds.at(-1) ?? ""
    const firstActiveId = activeIds[0] ?? ""

    for (const link of tocLinks) {
      const href = link.getAttribute("href")
      const id = href?.startsWith("#") ? href.slice(1) : ""
      setLinkActiveState(link, Boolean(id && activeSet.has(id)))
    }

    if (latestActiveId) {
      const latestLink = linksByHash.get(`#${latestActiveId}`)
      if (latestLink) {
        scrollActiveLinkIntoView(latestLink)
      }
    }

    if (mobileSummary && firstActiveId) {
      const matchingLink = linksByHash.get(`#${firstActiveId}`)
      if (matchingLink) {
        mobileSummary.textContent = matchingLink.textContent?.trim() ?? ""
      }
    }

    if (mobileProgress && mobileProgressTrackLength > 0 && latestActiveId) {
      const activeEndIndex = headingMap.get(latestActiveId) ?? -1
      const progress = (activeEndIndex + 1) / Math.max(1, headingIds.length)
      mobileProgress.style.strokeDashoffset = `${mobileProgressTrackLength * (1 - progress)}`
    }

    if (latestActiveId && history.replaceState) {
      history.replaceState(null, "", `#${latestActiveId}`)
    }
  }

  const syncFromViewport = (): void => {
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight
    const offset = getScrollspyOffset(viewportHeight)
    const scrollTop = window.visualViewport?.pageTop
      ?? window.scrollY
      ?? scrollRoot?.scrollTop
      ?? document.documentElement.scrollTop
      ?? 0
    const headingPositions = headings.map((heading) => ({
      id: heading.id,
      absoluteTop: heading.getBoundingClientRect().top + scrollTop,
    }))
    const activeIds = getActiveHeadingIds(headingPositions, scrollTop, viewportHeight, offset)
    applyActiveState(activeIds)
  }

  const requestSync = (): void => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      ticking = false
      syncFromViewport()
    })
  }

  const clickHandlers = new Map<HTMLAnchorElement, EventListener>()
  for (const link of tocLinks) {
    const handler: EventListener = (event) => {
      event.preventDefault()
      const hash = link.getAttribute("href")
      if (!hash) return

      const target = document.querySelector<HTMLElement>(hash)
      if (!target) return

      target.scrollIntoView({ behavior: "smooth" })

      if (mobileToc instanceof HTMLDetailsElement) {
        mobileToc.open = false
      }
    }

    clickHandlers.set(link, handler)
    link.addEventListener("click", handler)
  }

  window.addEventListener("scroll", requestSync, { passive: true })
  scrollRoot?.addEventListener("scroll", requestSync, { passive: true })
  window.addEventListener("resize", requestSync)
  window.addEventListener("orientationchange", requestSync)
  window.visualViewport?.addEventListener("scroll", requestSync, { passive: true })
  window.visualViewport?.addEventListener("resize", requestSync)
  document.addEventListener("scroll", requestSync, { passive: true, capture: true })

  const visibilityHandler = (): void => {
    if (document.visibilityState === "visible") {
      requestSync()
    }
  }
  document.addEventListener("visibilitychange", visibilityHandler)

  const io = new IntersectionObserver(requestSync, {
    root: null,
    threshold: [0, 0.1, 0.5, 0.9, 1],
  })
  for (const heading of headings) {
    io.observe(heading)
  }

  const intervalId = window.setInterval(requestSync, 250)
  syncFromViewport()

  cleanup = () => {
    window.removeEventListener("scroll", requestSync)
    scrollRoot?.removeEventListener("scroll", requestSync)
    window.removeEventListener("resize", requestSync)
    window.removeEventListener("orientationchange", requestSync)
    window.visualViewport?.removeEventListener("scroll", requestSync)
    window.visualViewport?.removeEventListener("resize", requestSync)
    document.removeEventListener("scroll", requestSync, { capture: true })
    document.removeEventListener("visibilitychange", visibilityHandler)
    io.disconnect()
    window.clearInterval(intervalId)

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
