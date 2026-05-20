import { QueryClient } from "@tanstack/react-query"

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
}

export function createQueryClient() {
  return new QueryClient(queryClientConfig)
}
