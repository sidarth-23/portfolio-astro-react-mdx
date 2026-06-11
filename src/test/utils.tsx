import { QueryClientProvider } from "@tanstack/react-query"
import { render as rtlRender } from "@testing-library/react"
import { experimental_AstroContainer as AstroContainer } from "astro/container"

import { createQueryClient } from "@/lib/query-client"

import type { AstroComponentFactory } from "astro/runtime/server/index.js"
import type { ReactElement } from "react"

export async function renderAstro(
  Component: AstroComponentFactory,
  props?: Record<string, string | number | boolean | null | undefined | object>,
  slots?: Record<string, string>
) {
  const container = await AstroContainer.create()
  const result = await container.renderToString(Component, {
    props,
    slots,
  })
  return result
}

export function renderReact(
  ui: ReactElement,
  { queryClient = createQueryClient(), ...options } = {}
) {
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    ...options,
  })
}
