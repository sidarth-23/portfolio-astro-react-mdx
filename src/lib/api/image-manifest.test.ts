import { describe, expect, it, beforeEach, vi } from "vitest"

const mockStat = vi.fn()
const mockReadFile = vi.fn()
const mockAccess = vi.fn()

vi.mock("node:fs/promises", () => ({
  default: {
    stat: (...args: unknown[]) => mockStat(...args),
    readFile: (...args: unknown[]) => mockReadFile(...args),
    access: (...args: unknown[]) => mockAccess(...args),
  },
  stat: (...args: unknown[]) => mockStat(...args),
  readFile: (...args: unknown[]) => mockReadFile(...args),
  access: (...args: unknown[]) => mockAccess(...args),
}))

import {
  getOptimizedImageSet,
  getOptimizedImageSrc,
  generateSrcSet,
  generateSizes,
  clearManifestCache,
} from "./image-manifest"

describe("image-manifest", () => {
  beforeEach(() => {
    clearManifestCache()
    mockStat.mockClear()
    mockReadFile.mockClear()
    mockAccess.mockClear()
  })

  describe("getOptimizedImageSet", () => {
    it("returns optimized image set for known path", async () => {
      const manifest = {
        "src/assets/images/test.jpg": {
          "400": "/_optimized/test-400.webp",
          "600": "/_optimized/test-600.webp",
          "1200": "/_optimized/test-1200.webp",
        },
      }

      mockStat.mockResolvedValue({ mtimeMs: 12345 })
      mockReadFile.mockResolvedValue(JSON.stringify(manifest))

      const result = await getOptimizedImageSet("src/assets/images/test.jpg")

      expect(result).toEqual({
        "400": "/_optimized/test-400.webp",
        "600": "/_optimized/test-600.webp",
        "1200": "/_optimized/test-1200.webp",
      })
    })

    it("returns null for unknown path", async () => {
      mockStat.mockRejectedValue(new Error("File not found"))

      const result = await getOptimizedImageSet("unknown/path.jpg")

      expect(result).toBeNull()
    })

    it("tries path variations for relative paths", async () => {
      const manifest = {
        "assets/images/test.jpg": {
          "400": "/_optimized/test-400.webp",
          "600": "/_optimized/test-600.webp",
          "1200": "/_optimized/test-1200.webp",
        },
      }

      mockStat.mockResolvedValue({ mtimeMs: 12345 })
      mockReadFile.mockResolvedValue(JSON.stringify(manifest))

      const result = await getOptimizedImageSet("../../../assets/images/test.jpg")

      expect(result).toEqual({
        "400": "/_optimized/test-400.webp",
        "600": "/_optimized/test-600.webp",
        "1200": "/_optimized/test-1200.webp",
      })
    })

    it("caches manifest for repeated calls", async () => {
      const manifest = {
        "src/assets/images/test.jpg": {
          "400": "/_optimized/test-400.webp",
          "600": "/_optimized/test-600.webp",
          "1200": "/_optimized/test-1200.webp",
        },
      }

      mockStat.mockResolvedValue({ mtimeMs: 12345 })
      mockReadFile.mockResolvedValue(JSON.stringify(manifest))

      await getOptimizedImageSet("src/assets/images/test.jpg")
      await getOptimizedImageSet("src/assets/images/test.jpg")

      expect(mockReadFile).toHaveBeenCalledTimes(1)
    })

    it("reloads manifest when file changes", async () => {
      const manifest = {
        "src/assets/images/test.jpg": {
          "400": "/_optimized/test-400.webp",
          "600": "/_optimized/test-600.webp",
          "1200": "/_optimized/test-1200.webp",
        },
      }

      mockStat
        .mockResolvedValueOnce({ mtimeMs: 12345 })
        .mockResolvedValueOnce({ mtimeMs: 67890 })
      mockReadFile.mockResolvedValue(JSON.stringify(manifest))

      await getOptimizedImageSet("src/assets/images/test.jpg")
      await getOptimizedImageSet("src/assets/images/test.jpg")

      expect(mockReadFile).toHaveBeenCalledTimes(2)
    })
  })

  describe("getOptimizedImageSrc", () => {
    it("returns optimized src for default size", async () => {
      const manifest = {
        "src/assets/images/test.jpg": {
          "400": "/_optimized/test-400.webp",
          "600": "/_optimized/test-600.webp",
          "1200": "/_optimized/test-1200.webp",
        },
      }

      mockStat.mockResolvedValue({ mtimeMs: 12345 })
      mockReadFile.mockResolvedValue(JSON.stringify(manifest))

      const result = await getOptimizedImageSrc("src/assets/images/test.jpg")

      expect(result).toBe("/_optimized/test-600.webp")
    })

    it("returns optimized src for specific size", async () => {
      const manifest = {
        "src/assets/images/test.jpg": {
          "400": "/_optimized/test-400.webp",
          "600": "/_optimized/test-600.webp",
          "1200": "/_optimized/test-1200.webp",
        },
      }

      mockStat.mockResolvedValue({ mtimeMs: 12345 })
      mockReadFile.mockResolvedValue(JSON.stringify(manifest))

      const result = await getOptimizedImageSrc("src/assets/images/test.jpg", "400")

      expect(result).toBe("/_optimized/test-400.webp")
    })

    it("returns original path as fallback for unknown images", async () => {
      mockStat.mockRejectedValue(new Error("File not found"))

      const result = await getOptimizedImageSrc("unknown/path.jpg")

      expect(result).toBe("unknown/path.jpg")
    })
  })

  describe("generateSrcSet", () => {
    it("generates srcset string", () => {
      const set = {
        "400": "/test-400.webp",
        "600": "/test-600.webp",
        "1200": "/test-1200.webp",
      }

      const result = generateSrcSet(set)

      expect(result).toBe("/test-400.webp 400w, /test-600.webp 600w, /test-1200.webp 1200w")
    })
  })

  describe("generateSizes", () => {
    it("generates default sizes", () => {
      const result = generateSizes()

      expect(result).toBe("(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw")
    })

    it("generates custom sizes", () => {
      const result = generateSizes({
        mobile: "90vw",
        tablet: "45vw",
        desktop: "30vw",
      })

      expect(result).toBe("(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw")
    })
  })
})