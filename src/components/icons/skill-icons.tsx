import { HugeiconsIcon } from "@hugeicons/react"
import {
  CloudIcon,
  DatabaseIcon,
  ApiIcon,
  LinkSquare02Icon,
  CodeIcon,
  Layers01Icon,
} from "@hugeicons/core-free-icons"
import {
  siGo,
  siPython,
  siPostgresql,
  siReact,
  siNextdotjs,
  siAstro,
  siTypescript,
  siTailwindcss,
} from "simple-icons/icons"

export type SkillIconInput = {
  source: "simple" | "huge" | "custom"
  name: string
}

type SimpleIconData = {
  title: string
  hex: string
  path: string
}

const simpleIconRegistry: Record<string, SimpleIconData> = {
  go: siGo,
  python: siPython,
  postgresql: siPostgresql,
  react: siReact,
  nextjs: siNextdotjs,
  astro: siAstro,
  typescript: siTypescript,
  tailwindcss: siTailwindcss,
}

const hugeIconRegistry = {
  cloud: CloudIcon,
  database: DatabaseIcon,
  api: ApiIcon,
  connection: LinkSquare02Icon,
  code: CodeIcon,
  layers: Layers01Icon,
}

function SimpleIconGlyph({
  icon,
  className,
}: {
  icon: SimpleIconData
  className?: string
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={{ color: `#${icon.hex}` }}
      aria-label={icon.title}
    >
      <path d={icon.path} />
    </svg>
  )
}

function DrizzleIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Drizzle"
    >
      <path
        d="M12 3C15.5 7.5 19 10.5 19 14.5C19 18.1 16.1 21 12.5 21C8.9 21 6 18.1 6 14.5C6 10.2 9.4 7.2 12 3Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function SkillIcon({
  icon,
  className = "size-3.5 shrink-0",
}: {
  icon: SkillIconInput
  className?: string
}) {
  if (icon.source === "simple") {
    const simple = simpleIconRegistry[icon.name]
    if (!simple) return null
    return <SimpleIconGlyph icon={simple} className={className} />
  }

  if (icon.source === "huge") {
    const huge = hugeIconRegistry[icon.name as keyof typeof hugeIconRegistry]
    if (!huge) return null
    return (
      <HugeiconsIcon
        icon={huge}
        size={14}
        strokeWidth={2}
        className={className}
      />
    )
  }

  if (icon.source === "custom" && icon.name === "drizzle") {
    return <DrizzleIcon className={className} />
  }

  return null
}
