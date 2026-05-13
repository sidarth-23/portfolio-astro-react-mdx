import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "./theme-toggle"
import { sidebarContent } from "@/lib/sidebar-content"

function isActiveLink(currentPath: string, url: string): boolean {
  if (url === "/") {
    return currentPath === "/"
  }
  return currentPath === url || currentPath.startsWith(url + "/")
}

export function Footer({ currentPath }: { currentPath: string }) {
  const year = new Date().getFullYear()
  const { navigation, social } = sidebarContent

  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto px-6 py-8 md:max-w-3xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </h3>
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  className={`text-sm transition-colors hover:text-foreground ${
                    isActiveLink(currentPath, item.url)
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Connect
            </h3>
            <nav className="flex flex-col gap-2">
              {social.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  target={item.url.startsWith("http") ? "_blank" : undefined}
                  rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Theme toggle on larger screens */}
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Appearance
            </h3>
            <ThemeToggle variant="expanded" />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-sm text-muted-foreground">
            Sid &copy; {year}
          </span>
          <a
            href="/rss.xml"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            RSS Feed
          </a>
        </div>
      </div>
    </footer>
  )
}
