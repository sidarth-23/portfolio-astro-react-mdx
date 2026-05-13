import { SidebarTrigger } from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon } from "@hugeicons/core-free-icons"

export function SiteHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
      <a
        href="/"
        className="text-lg font-semibold tracking-tight text-foreground"
      >
        Sid
      </a>
      <SidebarTrigger className="ml-auto">
        <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} className="size-5" />
        <span className="sr-only">Toggle sidebar</span>
      </SidebarTrigger>
    </header>
  )
}
