import { getActiveHeadingIds, type HeadingPosition } from "./scrollspy"

type CleanupFn = () => void

let cleanup: CleanupFn | null = null

const ACTIVE_TEXT = ["border-border", "text-foreground"]
const INACTIVE_TEXT = ["border-border/35", "text-muted-foreground/80"]

function getScrollTop(): number {
  const fromWindow = typeof window.scrollY === "number" ? window.scrollY : 0
  const fromDoc = document.documentElement?.scrollTop ?? 0
  const fromBody = document.body?.scrollTop ?? 0
  const fromVisualViewport = window.visualViewport?.pageTop ?? 0
  return Math.max(fromWindow, fromDoc, fromBody, fromVisualViewport)
}

function getViewportHeight(): number {
  const visualViewportHeight = window.visualViewport?.height ?? 0
  if (visualViewportHeight > 0) return visualViewportHeight
  if (window.innerHeight > 0) return window.innerHeight
  return document.documentElement?.clientHeight ?? 0
}

function collectHeadingIdsFromLinks(): string[] {
  const ids = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]"))
    .map((link) => link.getAttribute("href") ?? "")
    .filter((href) => href.startsWith("#"))
    .map((href) => decodeURIComponent(href.slice(1)))
  return ids.filter((id, index) => id.length > 0 && ids.indexOf(id) === index)
}

function collectHeadingPositions(ids: string[], scrollTop: number): HeadingPosition[] {
  return ids
    .map((id) => {
      const node = document.getElementById(id)
      if (!node) return null
      return {
        id,
        absoluteTop: node.getBoundingClientRect().top + scrollTop,
      }
    })
    .filter((entry): entry is HeadingPosition => Boolean(entry))
}

function setLinkState(link: HTMLAnchorElement, isActive: boolean): void {
  if (isActive) {
    link.classList.add(...ACTIVE_TEXT)
    link.classList.remove(...INACTIVE_TEXT)
  } else {
    link.classList.remove(...ACTIVE_TEXT)
    link.classList.add(...INACTIVE_TEXT)
  }
}

function updateLinks(links: HTMLAnchorElement[], activeIds: Set<string>): void {
  for (const link of links) {
    const href = link.getAttribute("href") ?? link.hash ?? ""
    const id = href.startsWith("#") ? decodeURIComponent(href.slice(1)) : ""
    setLinkState(link, Boolean(id && activeIds.has(id)))
  }
}

function updateMobileSummaryAndProgress(
  firstActiveId: string,
  latestActiveId: string,
  headingIds: string[],
  mobileLinks: HTMLAnchorElement[]
): void {
  const mobileSummary = document.querySelector<HTMLElement>("[data-toc-summary]")
  if (mobileSummary && firstActiveId) {
    const activeLink = mobileLinks.find((link) => (link.getAttribute("href") ?? "") === `#${firstActiveId}`)
    if (activeLink) {
      mobileSummary.textContent = activeLink.textContent?.trim() ?? ""
    }
  }

  const mobileProgress = document.querySelector<SVGCircleElement>("[data-toc-progress-value]")
  const circumference = Number(mobileProgress?.dataset.circumference ?? "0")
  if (mobileProgress && circumference > 0 && latestActiveId) {
    const endIndex = headingIds.indexOf(latestActiveId)
    const progress = (endIndex + 1) / Math.max(1, headingIds.length)
    mobileProgress.style.strokeDashoffset = `${circumference * (1 - progress)}`
  }
}

function ensureActiveMobileLinkVisible(latestActiveId: string): void {
  const mobileToc = document.querySelector('[data-toc="mobile"]')
  if (!(mobileToc instanceof HTMLDetailsElement) || !mobileToc.open || !latestActiveId) return

  const link = document.querySelector<HTMLAnchorElement>(`[data-toc='mobile'] [data-toc-link][href='#${latestActiveId}']`)
  link?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" })
}

function initTocScrollspy(): void {
  cleanup?.()
  cleanup = null

  let lastKey = ""

  const sync = (): void => {
    const headingIds = collectHeadingIdsFromLinks()
    if (headingIds.length === 0) return

    const scrollTop = getScrollTop()
    const viewportHeight = getViewportHeight()
    const positions = collectHeadingPositions(headingIds, scrollTop)
    if (positions.length === 0) return

    const activeIds = getActiveHeadingIds(positions, scrollTop, viewportHeight)
    const firstActiveId = activeIds[0] ?? ""
    const latestActiveId = activeIds.at(-1) ?? ""
    const mobileOpen = document.querySelector('[data-toc="mobile"]') instanceof HTMLDetailsElement
      ? (document.querySelector('[data-toc="mobile"]') as HTMLDetailsElement).open
      : false

    const key = `${activeIds.join("|")}|open:${mobileOpen ? "1" : "0"}`
    if (key === lastKey) return
    lastKey = key

    const activeSet = new Set(activeIds)
    const desktopLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('[data-toc="desktop"] [data-toc-link]')
    )
    const mobileLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('[data-toc="mobile"] [data-toc-link]')
    )

    updateLinks(desktopLinks, activeSet)
    updateLinks(mobileLinks, activeSet)
    updateMobileSummaryAndProgress(firstActiveId, latestActiveId, headingIds, mobileLinks)
    ensureActiveMobileLinkVisible(latestActiveId)
  }

  const onScroll = (): void => sync()
  const onResize = (): void => sync()
  const onVisibility = (): void => {
    if (document.visibilityState === "visible") sync()
  }

  const onTocLinkClick = (event: Event): void => {
    const target = event.target
    if (!(target instanceof Element)) return

    const link = target.closest<HTMLAnchorElement>("[data-toc-link]")
    if (!link) return

    event.preventDefault()
    const hash = link.getAttribute("href")
    if (!hash) return

    const heading = document.querySelector<HTMLElement>(hash)
    if (!heading) return

    heading.scrollIntoView({ behavior: "smooth" })
    if (history.replaceState) history.replaceState(null, "", hash)

    const mobileToc = document.querySelector('[data-toc="mobile"]')
    if (mobileToc instanceof HTMLDetailsElement) {
      mobileToc.open = false
    }
  }

  const mobileToc = document.querySelector('[data-toc="mobile"]')
  const onMobileToggle = (): void => sync()

  window.addEventListener("scroll", onScroll, { passive: true })
  document.addEventListener("scroll", onScroll, { passive: true, capture: true })
  window.addEventListener("resize", onResize)
  window.addEventListener("orientationchange", onResize)
  document.addEventListener("visibilitychange", onVisibility)
  document.addEventListener("click", onTocLinkClick)
  if (mobileToc instanceof HTMLDetailsElement) {
    mobileToc.addEventListener("toggle", onMobileToggle)
  }

  const visualViewport = window.visualViewport
  visualViewport?.addEventListener("scroll", onScroll, { passive: true })
  visualViewport?.addEventListener("resize", onResize)

  sync()

  cleanup = () => {
    window.removeEventListener("scroll", onScroll)
    document.removeEventListener("scroll", onScroll, true)
    window.removeEventListener("resize", onResize)
    window.removeEventListener("orientationchange", onResize)
    document.removeEventListener("visibilitychange", onVisibility)
    document.removeEventListener("click", onTocLinkClick)
    visualViewport?.removeEventListener("scroll", onScroll)
    visualViewport?.removeEventListener("resize", onResize)
    if (mobileToc instanceof HTMLDetailsElement) {
      mobileToc.removeEventListener("toggle", onMobileToggle)
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
