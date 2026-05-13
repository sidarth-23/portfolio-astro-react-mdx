import type { LanguageModel } from "ai"

export type ProviderConfig =
  | { provider: "openai"; model: string; apiKey?: string; baseURL?: string }
  | { provider: "custom"; model: string; apiKey: string; baseURL: string }

/**
 * Create a Vercel AI SDK LanguageModel from a provider config.
 * Uses dynamic imports so only the chosen provider package is loaded.
 */
export async function createModel(config: ProviderConfig): Promise<LanguageModel> {
  switch (config.provider) {
    case "openai": {
      const { createOpenAI } = await import("@ai-sdk/openai")
      const openai = createOpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
      })
      return openai(config.model)
    }
    case "custom": {
      const { createOpenAI } = await import("@ai-sdk/openai")
      const custom = createOpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
      })
      return custom(config.model)
    }
    default:
      throw new Error(
        `Unknown provider: ${(config as ProviderConfig).provider}`
      )
  }
}
