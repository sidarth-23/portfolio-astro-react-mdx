import { SidebarTrigger } from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon } from "@hugeicons/core-free-icons"
import { ThemeToggle } from "./theme-toggle"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SiteHeader({ avatarSrc }: { avatarSrc: string }) {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full shrink-0 items-center justify-between px-4 md:max-w-5xl">
        <a
          href="/"
          className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          <Avatar className="size-8">
            <AvatarImage src={avatarSrc} alt="Sidarth G" />
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              SG
            </AvatarFallback>
          </Avatar>
          <span>SG</span>
        </a>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Separator orientation="vertical" />
          <SidebarTrigger>
            <HugeiconsIcon
              icon={Menu01Icon}
              strokeWidth={2}
              className="size-5"
            />
            <span className="sr-only">Toggle sidebar</span>
          </SidebarTrigger>
        </div>
      </div>
    </header>
  )
}
