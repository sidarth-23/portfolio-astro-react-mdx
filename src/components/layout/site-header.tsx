import { SidebarTrigger } from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon } from "@hugeicons/core-free-icons"

export function SiteHeader() {
  return (
    <header className="border-b px-4">
      <div className="mx-auto flex h-16 w-full shrink-0 items-center justify-between md:max-w-3xl">
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
      </div>
    </header>
  )
}
