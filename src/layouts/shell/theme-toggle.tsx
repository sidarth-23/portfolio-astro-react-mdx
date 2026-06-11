import {
  Sun02Icon,
  Moon02Icon,
  ComputerIcon,
  ArrowDown01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger, Button 
} from "@/components/ui/react"

type Theme = "light" | "dark" | "system"

function getTheme(): Theme {
  if (typeof window === "undefined") return "system"
  return (localStorage.getItem("theme") as Theme) || "system"
}

function setThemeClass(theme: Theme) {
  const root = window.document.documentElement
  root.classList.remove("light", "dark")

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light"
    root.classList.add(systemTheme)
  } else {
    root.classList.add(theme)
  }
}

const themes: Theme[] = ["light", "dark", "system"]

const themeConfig: Record<Theme, { icon: typeof Sun02Icon; label: string }> = {
  light: {
    icon: Sun02Icon,
    label: "Light",
  },
  dark: {
    icon: Moon02Icon,
    label: "Dark",
  },
  system: {
    icon: ComputerIcon,
    label: "System",
  },
}

export function ThemeToggle({
  variant = "default",
}: {
  variant?: "default" | "expanded"
}) {
  const [theme, setThemeState] = React.useState<Theme>("system")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    const current = getTheme()
    setThemeState(current)
    setThemeClass(current)
  }, [])

  const handleThemeChange = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme)
    setThemeState(newTheme)
    setThemeClass(newTheme)
  }

  const currentIcon = themeConfig[theme].icon

  if (!mounted) {
    if (variant === "expanded") {
      return (
        <Button variant="outline" className="w-36 justify-start gap-2 px-2">
          <span className="size-4" />
          <span className="text-sm">Theme</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={2}
            className="ml-auto size-4 opacity-50"
          />
        </Button>
      )
    }

    return (
      <Button variant="ghost" size="icon-sm" className="size-9">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "expanded" ? (
          <Button variant="outline" className="w-36 justify-start gap-2 px-2">
            <HugeiconsIcon
              icon={currentIcon}
              strokeWidth={2}
              className="size-4 shrink-0"
            />
            <span className="text-sm">{themeConfig[theme].label}</span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="ml-auto size-4 opacity-50"
            />
          </Button>
        ) : (
          <Button variant="ghost" size="icon-sm" className="size-9">
            <HugeiconsIcon
              icon={currentIcon}
              strokeWidth={2}
              className="size-4"
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        {themes.map((t) => {
          const Icon = themeConfig[t].icon
          return (
            <DropdownMenuItem
              key={t}
              onClick={() => handleThemeChange(t)}
              className={`gap-3 px-3 py-2 ${theme === t ? "bg-muted text-foreground" : ""}`}
            >
              <HugeiconsIcon icon={Icon} strokeWidth={2} className="size-4" />
              <span>{themeConfig[t].label}</span>
              <span className="ml-auto flex w-4 items-center justify-center">
                {theme === t && (
                  <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} />
                )}
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
