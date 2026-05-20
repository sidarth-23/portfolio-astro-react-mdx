import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

interface CodePanel {
  id: string
  filename: string
  element: React.ReactElement
}

function extractPanels(children: React.ReactNode): CodePanel[] {
  const panels: CodePanel[] = []
  let index = 0

  function walk(node: React.ReactNode) {
    if (!node) return

    if (React.isValidElement(node)) {
      const props = node.props as Record<string, unknown>
      const filename = props["data-filename"] as string | undefined

      // Any element with data-filename is a code panel (MDX may wrap pre)
      if (filename) {
        panels.push({
          id: String(index++),
          filename,
          element: node,
        })
        return
      }

      // Recurse into children
      const childNodes = React.Children.toArray(
        (node.props as Record<string, React.ReactNode>)?.children
      )
      childNodes.forEach(walk)
    }
  }

  React.Children.toArray(children).forEach(walk)
  return panels
}

export function CodeGroup({ children }: { children: React.ReactNode }) {
  const panels = React.useMemo(() => extractPanels(children), [children])
  const [activeTab, setActiveTab] = useState(panels[0]?.id ?? "0")
  const [copied, setCopied] = useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleCopy = () => {
    if (!containerRef.current) return

    const activePanel = containerRef.current.querySelector(
      `[data-panel-id="${activeTab}"]`
    )
    if (!activePanel) return

    const codeElement = activePanel.querySelector("code")
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
        <div className="code-group-tabs" role="tablist">
          {panels.map((panel) => (
            <button
              key={panel.id}
              type="button"
              role="tab"
              className={`code-group-tab ${
                panel.id === activeTab ? "active" : ""
              }`}
              onClick={() => setActiveTab(panel.id)}
              aria-selected={panel.id === activeTab}
            >
              {panel.filename}
            </button>
          ))}
        </div>
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
      <div className="code-group-panels">
        {panels.length > 0 ? (
          panels.map((panel) => (
            <div
              key={panel.id}
              data-panel-id={panel.id}
              role="tabpanel"
              hidden={panel.id !== activeTab}
              className="code-group-panel"
            >
              {panel.element}
            </div>
          ))
        ) : (
          <div className="code-group-panel">{children}</div>
        )}
      </div>
    </div>
  )
}
