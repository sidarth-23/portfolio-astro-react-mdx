import { getCollection, type CollectionEntry } from "astro:content"
import type { z } from "zod"
import type { tagSchema } from "@/lib/schemas"

type Tag = z.infer<typeof tagSchema>

export async function getPublishedBlogPosts() {
  const posts = await getCollection("blog", ({ data }) => !data.draft)
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export async function getDraftBlogPosts() {
  return getCollection("blog", ({ data }) => data.draft)
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getCollection("blog", (entry) => entry.slug === slug)
  return posts[0] ?? null
}

export async function getBlogPostsByTag(tag: Tag) {
  const posts = await getCollection("blog", ({ data }) =>
    data.tags.includes(tag)
  )
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export function getAllTags(posts: CollectionEntry<"blog">[]): Tag[] {
  const tags = new Set<Tag>()
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tags.add(tag)
    }
  }
  return Array.from(tags).sort()
}

export async function getFeaturedProjects() {
  const projects = await getCollection("projects", ({ data }) => data.featured)
  return projects.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export async function getAllProjects() {
  const projects = await getCollection("projects")
  return projects.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export async function getProjectBySlug(slug: string) {
  const projects = await getCollection("projects", (entry) => entry.slug === slug)
  return projects[0] ?? null
}

export async function getProjectsByTag(tag: Tag) {
  const projects = await getCollection("projects", ({ data }) =>
    data.tags.includes(tag)
  )
  return projects.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export function getAllProjectTags(projects: CollectionEntry<"projects">[]): Tag[] {
  const tags = new Set<Tag>()
  for (const project of projects) {
    for (const tag of project.data.tags) {
      tags.add(tag)
    }
  }
  return Array.from(tags).sort()
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}
