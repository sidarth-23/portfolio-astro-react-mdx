import type { ShikiTransformer } from "shiki"

/**
 * Shiki transformer that extracts `filename="..."` from code block meta
 * and adds it as a `data-filename` attribute on the `<pre>` element.
 */
export const filenameTransformer = (): ShikiTransformer => ({
  name: "shiki-filename-extractor",
  pre(node) {
    const meta = this.options.meta?.__raw || ""
    const filenameMatch = meta.match(/filename="([^"]+)"/)
    if (filenameMatch) {
      node.properties["data-filename"] = filenameMatch[1]
    }
    return node
  },
})
