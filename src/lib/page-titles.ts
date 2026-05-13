const PATH_TITLE_MAP: Record<string, string> = {
  '/': 'Home',
  '/blog': 'Blog',
  '/projects': 'Projects',
}

export function resolvePageTitle(currentPath: string, override?: string): string {
  if (override) return override
  return PATH_TITLE_MAP[currentPath] ?? ''
}

export function registerPageTitle(path: string, title: string): void {
  PATH_TITLE_MAP[path] = title
}
