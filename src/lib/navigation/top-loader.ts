import topbar from "topbar"

const INIT_ATTRIBUTE = "data-navigation-top-loader-initialized"
const FALLBACK_BAR_COLOR = "#3b82f6"

function resolveTopbarColor(): string {
  if (typeof document === "undefined") {
    return FALLBACK_BAR_COLOR
  }

  const probe = document.createElement("span")
  probe.style.color = "var(--color-primary)"
  probe.style.position = "absolute"
  probe.style.opacity = "0"
  probe.style.pointerEvents = "none"
  document.body.append(probe)
  const resolved = getComputedStyle(probe).color.trim()
  probe.remove()

  return resolved || FALLBACK_BAR_COLOR
}

export function initNavigationTopLoader(): void {
  if (
    typeof document === "undefined" ||
    document.documentElement.hasAttribute(INIT_ATTRIBUTE)
  ) {
    return
  }

  document.addEventListener("astro:before-preparation", () => {
    const color = resolveTopbarColor()
    topbar.config({
      autoRun: false,
      barThickness: 2,
      barColors: {
        0: color,
        "1.0": color,
      },
      shadowBlur: 0,
    })
    topbar.show()
  })

  document.addEventListener("astro:page-load", () => {
    topbar.hide()
  })

  document.documentElement.setAttribute(INIT_ATTRIBUTE, "true")
}
