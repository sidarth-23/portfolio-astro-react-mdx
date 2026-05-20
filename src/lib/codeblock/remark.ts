import { visit } from "unist-util-visit"
import type { Code, Root } from "mdast"
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx"

function hasFilename(node: Code): boolean {
  if (!node.meta) return false
  return /filename="([^"]+)"/.test(node.meta)
}

function extractFilename(meta: string): string {
  const match = meta.match(/filename="([^"]+)"/)
  return match ? match[1] : ""
}

function isWhitespaceNode(node: unknown): boolean {
  if (typeof node !== "object" || node === null) return false
  const n = node as Record<string, unknown>
  if (n.type === "text" && typeof n.value === "string") {
    return /^\s*$/.test(n.value)
  }
  if (n.type === "paragraph" && Array.isArray(n.children)) {
    return n.children.every(
      (child: unknown) =>
        typeof child === "object" &&
        child !== null &&
        (child as Record<string, unknown>).type === "text" &&
        /^\s*$/.test(String((child as Record<string, unknown>).value))
    )
  }
  return false
}

interface Group {
  start: number
  end: number
  parent: Root | { children: unknown[] }
}

/**
 * Remark plugin that groups consecutive `code` blocks with `filename="..."`
 * into `<CodeGroup panels={[...]}>` MDX JSX elements.
 *
 * Single blocks with filenames still get wrapped (one-tab group).
 * Blocks without filenames pass through unchanged.
 */
export function remarkCodeGroup() {
  return (tree: Root) => {
    const groups: Group[] = []

    // First pass: identify groups (read-only)
    visit(tree, "code", (node, index, parent) => {
      if (!parent || typeof index !== "number") return
      if (!hasFilename(node)) return

      const alreadyGrouped = groups.some(
        (g) => g.parent === parent && index >= g.start && index <= g.end
      )
      if (alreadyGrouped) return

      let currentEnd = index

      for (let i = index + 1; i < parent.children.length; i++) {
        const sibling = parent.children[i]
        if (
          typeof sibling === "object" &&
          sibling !== null &&
          (sibling as Code).type === "code" &&
          hasFilename(sibling as Code)
        ) {
          currentEnd = i
        } else if (isWhitespaceNode(sibling)) {
          currentEnd = i
        } else {
          break
        }
      }

      groups.push({ start: index, end: currentEnd, parent })
    })

    // Second pass: replace groups in reverse order to preserve indices
    for (const group of groups.reverse()) {
      const { parent, start, end } = group
      const codeNodes = (parent.children as unknown[])
        .slice(start, end + 1)
        .filter((n) => (n as Code).type === "code") as Code[]

      const panels = codeNodes.map((node) => ({
        filename: extractFilename(node.meta || ""),
        lang: node.lang || "",
        code: node.value,
      }))

      const panelsAttr: MdxJsxAttribute = {
        type: "mdxJsxAttribute",
        name: "panelsJson",
        value: JSON.stringify(panels),
      }

      const codeGroupElement: MdxJsxFlowElement = {
        type: "mdxJsxFlowElement",
        name: "CodeGroup",
        attributes: [panelsAttr],
        children: codeNodes as MdxJsxFlowElement["children"],
      }

      ;(parent.children as unknown[]).splice(
        start,
        end - start + 1,
        codeGroupElement
      )
    }
  }
}
