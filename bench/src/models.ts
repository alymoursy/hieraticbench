export type Provider = "anthropic" | "openai" | "google" | "openrouter";
export type Effort = "low" | "medium" | "high" | "xhigh" | "max";

export type ModelSpec = {
  key: string;
  label: string;
  provider: Provider;
  id: string;
  /** Reasoning effort, where the provider supports it. Recorded with every result. */
  effort?: Effort;
};

// Shortcuts for `--models`. Anything else can be run as `provider:model-id`,
// e.g. `openai:gpt-5.1` or `openrouter:qwen/qwen3-vl-235b-a22b-instruct`.
// Keep the OpenRouter entries pointed at each lab's current flagship.
export const MODELS: ModelSpec[] = [
  { key: "claude-fable-5-1", label: "Claude Fable 5.1", provider: "anthropic", id: "claude-fable-5-1", effort: "high" },
  { key: "claude-opus-5-5", label: "Claude Opus 5.5", provider: "anthropic", id: "claude-opus-5-5", effort: "high" },
  { key: "claude-sonnet-5-5", label: "Claude Sonnet 5.5", provider: "anthropic", id: "claude-sonnet-5-5", effort: "high" },
  { key: "claude-haiku-4-5", label: "Claude Haiku 4.5", provider: "anthropic", id: "claude-haiku-4-5" },
  // Other labs through OpenRouter, current flagships as of October 2026.
  { key: "gpt-6-astra", label: "GPT-6 Astra", provider: "openrouter", id: "openai/gpt-6-astra", effort: "high" },
  { key: "gpt-6.1-sol", label: "GPT-6.1 Sol", provider: "openrouter", id: "openai/gpt-6.1-sol", effort: "high" },
  { key: "gemini-3.1-pro", label: "Gemini 3.1 Pro", provider: "openrouter", id: "google/gemini-3.1-pro-preview", effort: "high" },
  { key: "gemini-3.8-flash", label: "Gemini 3.8 Flash", provider: "openrouter", id: "google/gemini-3.8-flash", effort: "high" },
  { key: "grok-4.7", label: "Grok 4.7", provider: "openrouter", id: "x-ai/grok-4.7", effort: "high" },
  { key: "qwen3.8-max", label: "Qwen3.8 Max", provider: "openrouter", id: "qwen/qwen3.8-max-0902", effort: "high" },
  { key: "kimi-k3", label: "Kimi K3", provider: "openrouter", id: "moonshotai/kimi-k3", effort: "high" },
  { key: "mistral-medium-3.5", label: "Mistral Medium 3.5", provider: "openrouter", id: "mistralai/mistral-medium-3-5", effort: "high" },
  { key: "llama-4-maverick", label: "Llama 4 Maverick", provider: "openrouter", id: "meta-llama/llama-4-maverick" },
];

const PROVIDERS: Provider[] = ["anthropic", "openai", "google", "openrouter"];

export function resolveModel(name: string, effort?: Effort): ModelSpec {
  const known = MODELS.find((m) => m.key === name);
  if (known) return effort && known.effort ? { ...known, effort } : known;
  const [provider, ...rest] = name.split(":");
  const id = rest.join(":");
  if (!PROVIDERS.includes(provider as Provider) || !id) {
    throw new Error(
      `Unknown model "${name}". Use one of: ${MODELS.map((m) => m.key).join(", ")}, or provider:model-id with provider in ${PROVIDERS.join("/")}.`,
    );
  }
  return {
    key: `${provider}-${id}`.replace(/[^a-zA-Z0-9.-]+/g, "-"),
    label: id,
    provider: provider as Provider,
    id,
    effort,
  };
}
