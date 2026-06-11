import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/react"

export type CodePanel = {
  filename: string
  lang: string
  code: string
}

type CodeGroupClientProps = {
  panels: CodePanel[]
  children: React.ReactNode
}

export default function CodeGroupClient({
  panels,
  children,
}: CodeGroupClientProps) {
  const firstPanel = panels[0]?.filename ?? ""
  const [activeTab, setActiveTab] = useState(firstPanel)
  const [copied, setCopied] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const activeIndex = Math.max(
    0,
    panels.findIndex((panel) => panel.filename === activeTab)
  )

  useEffect(() => {
    const preElements = contentRef.current?.querySelectorAll("pre") ?? []
    preElements.forEach((pre, index) => {
      pre.toggleAttribute("hidden", index !== activeIndex)
    })
  }, [activeIndex])

  const handleCopy = () => {
    const activePanel = panels.find((panel) => panel.filename === activeTab)
    if (!activePanel) return

    navigator.clipboard.writeText(activePanel.code).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    })
  }

  if (panels.length === 0) {
    return <>{children}</>
  }

  return (
    <Tabs
      data-code-group=""
      value={activeTab}
      onValueChange={setActiveTab}
      className="relative my-6 gap-0 overflow-hidden rounded-lg border"
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 px-3 py-2">
        <TabsList variant="line" className="min-w-0 overflow-x-auto">
          {panels.map((panel) => (
            <TabsTrigger
              key={panel.filename}
              value={panel.filename}
              className="shrink-0 font-mono text-xs"
            >
              {panel.filename}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleCopy}
          aria-label="Copy code"
          className="shrink-0"
        >
          <HugeiconsIcon
            icon={copied ? Tick02Icon : Copy01Icon}
            size={14}
            strokeWidth={2}
          />
        </Button>
      </div>
      <TabsContent
        value={activeTab}
        forceMount
        className="m-0 text-[1em] [&_pre]:!m-0 [&_pre]:rounded-none [&_pre]:border-0 [&_pre]:!pt-16 [&_pre[hidden]]:hidden"
      >
        <div ref={contentRef}>{children}</div>
      </TabsContent>
    </Tabs>
  )
}
