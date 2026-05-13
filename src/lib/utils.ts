import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if the current path matches a navigation URL.
 * Root paths (e.g. /en, /fr) only match exactly so that /en/projects
 * doesn't incorrectly mark the home link as active.
 */
export function isActiveLink(currentPath: string, url: string): boolean {
  if (url === "/") {
    return currentPath === "/"
  }
  if (currentPath === url) return true
  // Only prefix-match for non-root paths to avoid /en matching /en/projects
  const urlSegments = url.split("/").filter(Boolean)
  if (urlSegments.length > 1) {
    return currentPath.startsWith(url + "/")
  }
  return false
}
