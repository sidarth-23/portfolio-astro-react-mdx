import { describe, expect, it, vi } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderReact } from "@/test/utils"
import CodeGroupClient, { type CodePanel } from "./CodeGroupClient"

const panels: CodePanel[] = [
  {
    filename: "schema.ts",
    lang: "typescript",
    code: "export const schema = {}",
  },
  {
    filename: "queries.ts",
    lang: "typescript",
    code: "export async function query() {}",
  },
  {
    filename: "client.ts",
    lang: "typescript",
    code: "export function Client() { return null }",
  },
]

function renderCodeGroup() {
  return renderReact(
    <CodeGroupClient panels={panels}>
      <pre data-testid="schema-code">
        <code>{panels[0].code}</code>
      </pre>
      <pre data-testid="queries-code">
        <code>{panels[1].code}</code>
      </pre>
      <pre data-testid="client-code">
        <code>{panels[2].code}</code>
      </pre>
    </CodeGroupClient>
  )
}

describe("CodeGroupClient", () => {
  it("renders Fulldev tabs from panel metadata", () => {
    renderCodeGroup()

    const tabs = screen.getAllByRole("tab")
    expect(tabs).toHaveLength(3)
    expect(tabs[0]).toHaveTextContent("schema.ts")
    expect(tabs[1]).toHaveTextContent("queries.ts")
    expect(tabs[2]).toHaveTextContent("client.ts")
    expect(tabs[0]).toHaveAttribute("aria-selected", "true")
  })

  it("switches tabs and renders the matching code block", async () => {
    renderCodeGroup()

    const tabs = screen.getAllByRole("tab")

    await waitFor(() => {
      expect(screen.getByTestId("schema-code")).not.toHaveAttribute("hidden")
      expect(screen.getByTestId("queries-code")).toHaveAttribute("hidden")
      expect(screen.getByTestId("client-code")).toHaveAttribute("hidden")
    })

    await userEvent.click(tabs[1])

    expect(tabs[0]).toHaveAttribute("aria-selected", "false")
    expect(tabs[1]).toHaveAttribute("aria-selected", "true")

    await waitFor(() => {
      expect(screen.getByTestId("schema-code")).toHaveAttribute("hidden")
      expect(screen.getByTestId("queries-code")).not.toHaveAttribute("hidden")
      expect(screen.getByTestId("client-code")).toHaveAttribute("hidden")
    })

    await userEvent.click(tabs[2])

    expect(tabs[1]).toHaveAttribute("aria-selected", "false")
    expect(tabs[2]).toHaveAttribute("aria-selected", "true")

    await waitFor(() => {
      expect(screen.getByTestId("schema-code")).toHaveAttribute("hidden")
      expect(screen.getByTestId("queries-code")).toHaveAttribute("hidden")
      expect(screen.getByTestId("client-code")).not.toHaveAttribute("hidden")
    })
  })

  it("copies active panel code from metadata", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    })

    renderCodeGroup()

    await userEvent.click(screen.getAllByRole("tab")[1])
    await userEvent.click(screen.getByRole("button", { name: "Copy code" }))

    expect(writeText).toHaveBeenCalledWith("export async function query() {}")
  })
})
