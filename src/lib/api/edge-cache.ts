interface WorkerCaches {
  default?: Cache
}

export interface EdgeCacheOptions {
  /** Defer the cache write so the response isn't delayed (Workers ctx.waitUntil). */
  waitUntil?: (promise: Promise<unknown>) => void
}

function getEdgeCache(): Cache | undefined {
  // Cloudflare Workers expose caches.default (per-colo cache); browsers and
  // Node test environments don't — fall through to producing the response.
  return (globalThis as { caches?: WorkerCaches }).caches?.default
}

/**
 * Per-colo response caching for build-time-static API responses. Worker
 * responses are not edge-cached by Cloudflare automatically — Cache-Control
 * alone is not enough — so cache hits/writes go through caches.default
 * explicitly. The produced response's own Cache-Control header drives the TTL.
 */
export async function withEdgeCache(
  request: Request,
  produce: () => Promise<Response>,
  options: EdgeCacheOptions = {}
): Promise<Response> {
  const cache = getEdgeCache()
  if (!cache || request.method !== "GET") {
    return produce()
  }

  const cacheKey = new Request(request.url)

  const cached = await cache.match(cacheKey).catch(() => undefined)
  if (cached) return cached

  const response = await produce()
  if (response.ok) {
    const write = cache.put(cacheKey, response.clone()).catch(() => {})
    if (options.waitUntil) {
      options.waitUntil(write)
    } else {
      await write
    }
  }

  return response
}
