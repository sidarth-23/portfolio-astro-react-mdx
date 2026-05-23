import type { Element, Root } from "hast"
import type { Node } from "unist"

type MdxFlowElementLike = Node & {
  type: "mdxJsxFlowElement"
  name?: string
}

function isElement(node: Node | null | undefined): node is Element {
  return (
    typeof node === "object" &&
    node !== null &&
    (node as Element).type === "element"
  )
}

function isPre(node: Node | null | undefined): node is Element {
  return isElement(node) && node.tagName === "pre"
}

function isInsideCodeGroup(ancestors: Node[]): boolean {
  return ancestors.some((ancestor) => {
    if (ancestor.type === "mdxJsxFlowElement") {
      const node = ancestor as MdxFlowElementLike
      if (node.name === "CodeGroup") return true
    }

    if (!isElement(ancestor)) return false
    return (
      ancestor.properties?.["data-code-group"] !== undefined
    )
  })
}

function getFilename(pre: Element): string | null {
  const filename = pre.properties?.["data-filename"]
  return typeof filename === "string" && filename.length > 0 ? filename : null
}

function copyIcon(): Element {
  return {
    type: "element",
    tagName: "svg",
    properties: {
      xmlns: "http://www.w3.org/2000/svg",
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "data-copy-icon": "",
    },
    children: [
      {
        type: "element",
        tagName: "rect",
        properties: { x: "9", y: "9", width: "13", height: "13", rx: "2" },
        children: [],
      },
      {
        type: "element",
        tagName: "path",
        properties: {
          d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
        },
        children: [],
      },
    ],
  }
}

function checkIcon(): Element {
  return {
    type: "element",
    tagName: "svg",
    properties: {
      xmlns: "http://www.w3.org/2000/svg",
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: "hidden",
      "data-check-icon": "",
    },
    children: [
      {
        type: "element",
        tagName: "polyline",
        properties: { points: "20 6 9 17 4 12" },
        children: [],
      },
    ],
  }
}

function copyButton(isFloating: boolean): Element {
  return {
    type: "element",
    tagName: "button",
    properties: {
      type: "button",
      "aria-label": "Copy code",
      class: [
        "inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        isFloating ? "absolute right-1.5 top-1.5 z-10" : "shrink-0",
      ].join(" "),
      onclick:
        "(function(btn){var root=btn.closest('[data-code-block]');var code=root&&root.querySelector('code');if(!code)return;navigator.clipboard.writeText(code.textContent||'').then(function(){var copy=btn.querySelector('[data-copy-icon]');var check=btn.querySelector('[data-check-icon]');if(copy)copy.classList.add('hidden');if(check)check.classList.remove('hidden');setTimeout(function(){if(copy)copy.classList.remove('hidden');if(check)check.classList.add('hidden')},2000)})})(this)",
    },
    children: [copyIcon(), checkIcon()],
  }
}

function codeBlockWrapper(pre: Element): Element {
  const filename = getFilename(pre)
  const hasFilename = filename !== null
  pre.properties = {
    ...pre.properties,
    class: [pre.properties?.class, "!m-0 rounded-none border-0"]
      .filter(Boolean)
      .join(" "),
  }

  return {
    type: "element",
    tagName: "div",
    properties: {
      class: "relative my-6 overflow-hidden rounded-lg border",
      "data-code-block": "",
    },
    children: hasFilename
      ? [
          {
            type: "element",
            tagName: "div",
            properties: {
              class: "flex items-center justify-between gap-3 px-3 py-2",
            },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: {
                  class:
                    "truncate font-mono text-xs font-medium text-muted-foreground",
                },
                children: [{ type: "text", value: filename }],
              },
              copyButton(false),
            ],
          },
          pre,
        ]
      : [copyButton(true), pre],
  }
}

function walk(node: Root | Element, ancestors: Node[] = []) {
  const children = node.children
  for (let index = 0; index < children.length; index++) {
    const child = children[index] as Node
    if (isPre(child) && !isInsideCodeGroup(ancestors)) {
      children.splice(index, 1, codeBlockWrapper(child))
      continue
    }
    if (
      isElement(child) ||
      (typeof child === "object" &&
        child !== null &&
        "children" in child &&
        Array.isArray((child as Root).children))
    ) {
      walk(child as Root | Element, [...ancestors, child])
    }
  }
}

/** Wraps standalone code blocks at build time. Code groups are handled by CodeGroup. */
export function rehypeCodeBlocks() {
  return (tree: Root) => {
    walk(tree)
  }
}
