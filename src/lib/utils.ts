import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function normalizePath(path: string): string {
  if (path === "/") return path
  return path.endsWith("/") ? path.slice(0, -1) : path
}

/**
 * Check if the current path matches a navigation URL.
 * Root paths (e.g. /en, /fr) only match exactly so that /en/projects
 * doesn't incorrectly mark the home link as active.
 */
export function isActiveLink(currentPath: string, url: string): boolean {
  const normalizedCurrentPath = normalizePath(currentPath)
  const normalizedUrl = normalizePath(url)

  if (normalizedUrl === "/") {
    return normalizedCurrentPath === "/"
  }

  if (normalizedCurrentPath === normalizedUrl) return true

  // Only prefix-match for non-root paths to avoid /en matching /en/projects
  const urlSegments = normalizedUrl.split("/").filter(Boolean)
  if (urlSegments.length > 1) {
    return normalizedCurrentPath.startsWith(normalizedUrl + "/")
  }

  return false
}
