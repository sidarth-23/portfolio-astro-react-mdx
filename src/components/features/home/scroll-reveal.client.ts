export function initScrollReveal() {
  const els = document.querySelectorAll<HTMLElement>("[data-reveal]")

  if (typeof window.IntersectionObserver === "function" && els.length > 0) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).dataset.reveal = "visible"
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    )
    els.forEach((el) => io.observe(el))
  } else {
    els.forEach((el) => (el.dataset.reveal = "visible"))
  }
}

document.addEventListener("astro:page-load", initScrollReveal)
