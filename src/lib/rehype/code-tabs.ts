import { visit } from "unist-util-visit"
import type { Element, Root, Text } from "hast"

function isPreWithFilename(node: unknown): node is Element {
  return (
    typeof node === "object" &&
    node !== null &&
    (node as Element).type === "element" &&
    (node as Element).tagName === "pre" &&
    (node as Element).properties?.["data-filename"] !== undefined
  )
}

function isWhitespaceText(node: unknown): boolean {
  return (
    typeof node === "object" &&
    node !== null &&
    (node as Text).type === "text" &&
    /^\s*$/.test((node as Text).value)
  )
}

interface Target {
  parent: Element | Root
  index: number
}

/**
 * Rehype plugin that groups consecutive `<pre data-filename>` blocks
 * into a tabbed code block container.
 *
 * Single blocks with filenames still get a tab bar (one tab).
 * Blocks without filenames pass through unchanged.
 */
export function rehypeCodeTabs() {
  return (tree: Root) => {
    // Collect all pre elements with data-filename
    const targets: Target[] = []

    visit(tree, "element", (node, index, parent) => {
      if (isPreWithFilename(node) && parent && typeof index === "number") {
        targets.push({ parent, index })
      }
    })

    if (targets.length === 0) return

    // Group targets that are in the same parent and separated only by whitespace
    const groups: Array<{ targets: Target[]; endIndex: number }> = []
    const visited = new Set<number>()

    for (let i = 0; i < targets.length; i++) {
      if (visited.has(i)) continue

      const groupTargets: Target[] = [targets[i]]
      visited.add(i)
      let endIndex = targets[i].index

      // Look ahead for more targets in the same parent
      for (let j = i + 1; j < targets.length; j++) {
        if (visited.has(j)) continue
        if (targets[j].parent !== targets[i].parent) break

        // Check if everything between endIndex and targets[j].index is whitespace
        let allWhitespace = true
        for (let k = endIndex + 1; k < targets[j].index; k++) {
          if (!isWhitespaceText(targets[i].parent.children[k])) {
            allWhitespace = false
            break
          }
        }

        if (allWhitespace) {
          groupTargets.push(targets[j])
          visited.add(j)
          endIndex = targets[j].index
        } else {
          break
        }
      }

      groups.push({ targets: groupTargets, endIndex })
    }

    // Process groups in reverse order to preserve indices
    for (let g = groups.length - 1; g >= 0; g--) {
      const { targets: groupTargets, endIndex } = groups[g]
      const parent = groupTargets[0].parent
      const startIndex = groupTargets[0].index

      const filenames = groupTargets.map((t) => {
        const node = t.parent.children[t.index]
        return node.type === "element"
          ? String(node.properties?.["data-filename"] ?? "")
          : ""
      })

      // Create tab buttons
      const tabButtons = filenames.map((filename, i) => ({
        type: "element" as const,
        tagName: "button",
        properties: {
          type: "button",
          role: "tab",
          "data-tab": String(i),
          class: i === 0 ? "code-tabs-trigger active" : "code-tabs-trigger",
          "aria-selected": i === 0 ? "true" : "false",
        },
        children: [{ type: "text" as const, value: filename }],
      }))

      // Create tab panels wrapping each pre element
      const tabPanels = groupTargets.map((t, i) => ({
        type: "element" as const,
        tagName: "div",
        properties: {
          role: "tabpanel",
          "data-tab-panel": String(i),
          class: i === 0 ? "code-tabs-panel active" : "code-tabs-panel",
        },
        children: [t.parent.children[t.index] as Element],
      }))

      // Tab list container
      const tabList: Element = {
        type: "element",
        tagName: "div",
        properties: {
          class: "code-tabs-list",
          role: "tablist",
        },
        children: tabButtons,
      }

      // Panels container
      const panelsContainer: Element = {
        type: "element",
        tagName: "div",
        properties: {
          class: "code-tabs-panels",
        },
        children: tabPanels,
      }

      // Outer container
      const container: Element = {
        type: "element",
        tagName: "div",
        properties: {
          class: "code-tabs",
          "data-code-tabs": "",
        },
        children: [tabList, panelsContainer],
      }

      // Calculate how many nodes to remove (including whitespace between blocks)
      const removeCount = endIndex - startIndex + 1
      parent.children.splice(startIndex, removeCount, container)
    }
  }
}
