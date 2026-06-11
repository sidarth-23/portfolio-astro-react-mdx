export function NavFooter({
  items,
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
    isExternal: boolean
  }[]
}) {
  return (
    <div className="flex items-center justify-center gap-6 pt-2">
      {items.map((item) => (
        <a
          key={item.title}
          href={item.url}
          target={item.isExternal ? "_blank" : undefined}
          rel={item.isExternal ? "noopener noreferrer" : undefined}
          aria-label={item.title}
          className="text-sidebar-foreground transition-colors hover:text-sidebar-foreground/80"
        >
          {item.icon}
        </a>
      ))}
    </div>
  )
}
