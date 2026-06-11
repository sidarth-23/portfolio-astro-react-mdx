import { createElement } from "react"
import satori from "satori"
import sharp from "sharp"
import { readFile } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FONTS_DIR = path.resolve(__dirname, "../../assets/fonts")

let cachedFonts: Array<{
  name: string
  data: ArrayBuffer
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  style: "normal" | "italic"
}> | null = null

async function loadFonts() {
  if (cachedFonts) return cachedFonts

  const [regularData, boldData] = await Promise.all([
    readFile(path.join(FONTS_DIR, "atkinson-regular.woff")),
    readFile(path.join(FONTS_DIR, "atkinson-bold.woff")),
  ])

  cachedFonts = [
    {
      name: "Atkinson Hyperlegible",
      data: regularData.buffer.slice(
        regularData.byteOffset,
        regularData.byteOffset + regularData.byteLength
      ),
      weight: 400,
      style: "normal",
    },
    {
      name: "Atkinson Hyperlegible",
      data: boldData.buffer.slice(
        boldData.byteOffset,
        boldData.byteOffset + boldData.byteLength
      ),
      weight: 700,
      style: "normal",
    },
  ]

  return cachedFonts
}

export function clampText(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, " ").trim()
  if (normalized.length <= maxLength) return normalized
  return normalized.slice(0, maxLength - 1).trimEnd() + "…"
}

export interface OgTemplateProps {
  title: string
  description: string
  coverImageDataUrl?: string
  siteLabel: string
}

export function hasCoverImage(coverImageDataUrl?: string): boolean {
  return Boolean(coverImageDataUrl?.trim())
}

export function siteUrlToLabel(siteUrl: string): string {
  return new URL(siteUrl).hostname
}

function OgTemplate({
  title,
  description,
  coverImageDataUrl,
  siteLabel,
}: OgTemplateProps) {
  const displayTitle = clampText(title, 60)
  const displayDescription = clampText(description, 132)

  return createElement(
    "div",
    {
      style: {
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
        padding: "56px 64px",
        position: "relative",
        fontFamily: "'Atkinson Hyperlegible', sans-serif",
      },
    },
    createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(circle at 80% 20%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(139,92,246,0.08) 0%, transparent 50%)",
        display: "flex",
      },
    }),
    createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flex: 1,
          gap: 40,
        },
      },
      createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            gap: 20,
          },
        },
        createElement("div", {
          style: {
            width: 48,
            height: 4,
            background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            borderRadius: 2,
            display: "flex",
          },
        }),
        createElement(
          "div",
          {
            style: {
              fontSize: displayTitle.length > 40 ? 52 : 62,
              fontWeight: 700,
              color: "#f8fafc",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              display: "flex",
            },
          },
          displayTitle
        ),
        createElement(
          "div",
          {
            style: {
              maxWidth: 720,
              fontSize: 26,
              fontWeight: 400,
              color: "rgba(226,232,240,0.78)",
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
              display: "flex",
            },
          },
          displayDescription
        )
      ),
      hasCoverImage(coverImageDataUrl)
        ? createElement(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 320,
                height: 210,
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(148,163,184,0.25)",
                background: "rgba(15,23,42,0.55)",
                flexShrink: 0,
                marginTop: 34,
              },
            },
            createElement("img", {
              src: coverImageDataUrl,
              width: 320,
              height: 210,
              style: {
                objectFit: "cover",
                display: "flex",
              },
            })
          )
        : null
    ),
    createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 28,
          borderTop: "1px solid rgba(148,163,184,0.15)",
        },
      },
      createElement(
        "div",
        {
          style: {
            fontSize: 22,
            fontWeight: 400,
            color: "rgba(148,163,184,0.8)",
            letterSpacing: "0.02em",
            display: "flex",
          },
        },
        siteLabel
      )
    )
  )
}

export async function renderOgImage(options: OgTemplateProps): Promise<Buffer> {
  const fonts = await loadFonts()

  const svg = await satori(createElement(OgTemplate, options), {
    width: 1200,
    height: 630,
    fonts,
  })

  return sharp(Buffer.from(svg)).png().toBuffer()
}
