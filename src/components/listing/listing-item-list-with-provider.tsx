"use client"

import { HydratedQueryProvider } from "@/components/providers/hydrated-query-provider"
import { ItemListClient } from "@/components/listing/listing-item-list-client"
import type { DehydratedState } from "@tanstack/react-query"
import type { Locale } from "@/i18n/config"
import type { ComponentType } from "react"

interface ItemListWithProviderProps<T> {
  dehydratedState: DehydratedState
  locale: Locale
  tags: string[]
  initialSearch: string
  initialTag: string | null
  endpoint: string
  gridClassName: string
  skeletonCount: number
  CardComponent: ComponentType<{ item: T; locale: Locale }>
  getItemKey: (item: T) => string
}

export function ItemListWithProvider<T>({
  dehydratedState,
  locale,
  tags,
  initialSearch,
  initialTag,
  endpoint,
  gridClassName,
  skeletonCount,
  CardComponent,
  getItemKey,
}: ItemListWithProviderProps<T>) {
  return (
    <HydratedQueryProvider dehydratedState={dehydratedState}>
      <ItemListClient
        locale={locale}
        tags={tags}
        initialSearch={initialSearch}
        initialTag={initialTag}
        endpoint={endpoint}
        gridClassName={gridClassName}
        skeletonCount={skeletonCount}
        CardComponent={CardComponent}
        getItemKey={getItemKey}
      />
    </HydratedQueryProvider>
  )
}
