"use client"

import {
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query"
import { useState, type ReactNode } from "react"
import type { DehydratedState } from "@tanstack/react-query"
import { createQueryClient } from "@/lib/query-client"

interface HydratedQueryProviderProps {
  dehydratedState: DehydratedState
  children: ReactNode
}

export function HydratedQueryProvider({
  dehydratedState,
  children,
}: HydratedQueryProviderProps) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </QueryClientProvider>
  )
}
