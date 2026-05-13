export function NavFooter({
  items,
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
  }[]
}) {
  return (
    <div className="flex items-center justify-center gap-6">
      {items.map((item) => {
        return <div>{item.icon}</div>
      })}
    </div>
  )
}
