import { getActiveHeadingHash, getScrollspyOffset } from "./scrollspy"

type CleanupFn = () => void

let observer: IntersectionObserver | null = null
let cleanup: CleanupFn | null = null

function initTocScrollspy(): void {
  cleanup?.()
  cleanup = null

  observer?.disconnect()
  observer = null

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

  let currentActiveHash = ""
  let ticking = false

  const setActive = (hash: string): void => {
    if (!hash || hash === currentActiveHash) return
    currentActiveHash = hash

    for (const link of tocLinks) {
      const isActive = link.getAttribute("href") === hash
      if (isActive) {
        link.classList.add("border-border", "text-foreground")
        link.classList.remove("border-transparent", "text-muted-foreground/80")
      } else {
        link.classList.remove("border-border", "text-foreground")
        link.classList.add("border-transparent", "text-muted-foreground/80")
      }
    }

    if (mobileSummary) {
      const matchingLink = tocLinks.find((link) => link.getAttribute("href") === hash)
      if (matchingLink) {
        mobileSummary.textContent = `On this page · ${matchingLink.textContent?.trim() ?? ""}`
      }
    }

    if (history.replaceState) {
      history.replaceState(null, "", hash)
    }
  }

  const syncActiveFromViewport = (): void => {
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight
    const offset = getScrollspyOffset(viewportHeight)
    const hash = getActiveHeadingHash(
      headings.map((heading) => ({
        id: heading.id,
        top: heading.getBoundingClientRect().top,
      })),
      offset
    )
    setActive(hash)
  }

  const requestSync = (): void => {
    if (ticking) return
    ticking = true

    requestAnimationFrame(() => {
      ticking = false
      syncActiveFromViewport()
    })
  }

  observer = new IntersectionObserver(requestSync, {
    rootMargin: "-10% 0px -70% 0px",
    threshold: 0,
  })

  for (const heading of headings) {
    observer.observe(heading)
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
      setActive(hash)

      if (mobileToc instanceof HTMLDetailsElement) {
        mobileToc.open = false
      }
    }

    clickHandlers.set(link, handler)
    link.addEventListener("click", handler)
  }

  window.addEventListener("scroll", requestSync, { passive: true })
  document.addEventListener("scroll", requestSync, { passive: true, capture: true })
  window.addEventListener("resize", requestSync)
  window.addEventListener("orientationchange", requestSync)
  window.visualViewport?.addEventListener("scroll", requestSync, { passive: true })
  window.visualViewport?.addEventListener("resize", requestSync)
  syncActiveFromViewport()

  cleanup = () => {
    window.removeEventListener("scroll", requestSync)
    document.removeEventListener("scroll", requestSync, { capture: true })
    window.removeEventListener("resize", requestSync)
    window.removeEventListener("orientationchange", requestSync)
    window.visualViewport?.removeEventListener("scroll", requestSync)
    window.visualViewport?.removeEventListener("resize", requestSync)

    for (const [link, handler] of clickHandlers) {
      link.removeEventListener("click", handler)
    }

    observer?.disconnect()
    observer = null
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
