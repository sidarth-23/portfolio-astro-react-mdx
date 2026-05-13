export function SimpleIcon({
  icon,
}: {
  icon: { title: string; path: string }
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className="size-4 shrink-0"
    >
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  )
}
