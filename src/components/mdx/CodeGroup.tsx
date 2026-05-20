import * as React from "react"
import { useState, useRef, useLayoutEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

interface CodeTab {
  id: string
  filename: string
}

export function CodeGroup({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tabs, setTabs] = useState<CodeTab[]>([])
  const [activeTab, setActiveTab] = useState("0")
  const [copied, setCopied] = useState(false)

  // Scan for pre elements after hydration (before paint)
  useLayoutEffect(() => {
    if (!containerRef.current) return

    // Pre elements might be inside astro-slot
    const preElements = containerRef.current.querySelectorAll(
      "pre[data-filename]"
    )

    const newTabs = Array.from(preElements).map((pre, index) => ({
      id: String(index),
      filename: pre.getAttribute("data-filename") || `File ${index + 1}`,
    }))

    setTabs(newTabs)

    // Style all panels
    preElements.forEach((pre, index) => {
      const el = pre as HTMLElement
      el.style.display = index === 0 ? "block" : "none"
      el.style.margin = "0"
      el.style.borderRadius = "0"
      el.style.border = "none"
    })
  }, [])

  // Update visibility when active tab changes
  useLayoutEffect(() => {
    if (!containerRef.current) return

    const preElements = containerRef.current.querySelectorAll(
      "pre[data-filename]"
    )

    preElements.forEach((pre, index) => {
      const el = pre as HTMLElement
      el.style.display = index === parseInt(activeTab) ? "block" : "none"
    })
  }, [activeTab])

  const handleCopy = () => {
    if (!containerRef.current) return

    const preElements = containerRef.current.querySelectorAll(
      "pre[data-filename]"
    )
    const activePre = preElements[parseInt(activeTab)]
    if (!activePre) return

    const codeElement = activePre.querySelector("code")
    if (!codeElement) return

    const code = codeElement.textContent || ""
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="code-group" ref={containerRef} data-code-group="">
      <div className="code-group-header">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.filename}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          <HugeiconsIcon
            icon={copied ? Tick02Icon : Copy01Icon}
            size={14}
            strokeWidth={2}
          />
        </Button>
      </div>
      {children}
    </div>
  )
}
