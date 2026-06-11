import { visit } from "unist-util-visit"

import type { Code, Paragraph, Root, RootContent } from "mdast"
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx"

function hasFilename(node: Code): boolean {
  if (!node.meta) return false
  return /filename="([^"]+)"/.test(node.meta)
}

function extractFilename(meta: string): string {
  const match = meta.match(/filename="([^"]+)"/)
  return match ? match[1] : ""
}

function isWhitespaceNode(node: RootContent): boolean {
  if (node.type === "text") return /^\s*$/.test(node.value)
  if (node.type !== "paragraph") return false

  const paragraph = node as Paragraph
  const textChildren = paragraph.children.filter(
    (child) => child.type === "text"
  )
  return (
    textChildren.length === paragraph.children.length &&
    textChildren.every((child) => /^\s*$/.test(child.value))
  )
}

type ParentWithChildren = {
  children: RootContent[]
}

interface Group {
  start: number
  end: number
  parent: ParentWithChildren
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
      const parentWithChildren = parent as ParentWithChildren
      if (!hasFilename(node)) return

      const alreadyGrouped = groups.some(
        (g) => g.parent === parent && index >= g.start && index <= g.end
      )
      if (alreadyGrouped) return

      let currentEnd = index

      for (let i = index + 1; i < parent.children.length; i++) {
        const sibling = parentWithChildren.children[i]
        if (sibling.type === "code" && hasFilename(sibling)) {
          currentEnd = i
        } else if (isWhitespaceNode(sibling)) {
          currentEnd = i
        } else {
          break
        }
      }

      groups.push({ start: index, end: currentEnd, parent: parentWithChildren })
    })

    // Second pass: replace groups in reverse order to preserve indices
    for (const group of groups.reverse()) {
      const { parent, start, end } = group
      const codeNodes = parent.children
        .slice(start, end + 1)
        .filter((n): n is Code => n.type === "code")

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

      parent.children.splice(start, end - start + 1, codeGroupElement)
    }
  }
}
