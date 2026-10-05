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
// Keep the OpenAI and Google entries pointed at each lab's current flagship.
export const MODELS: ModelSpec[] = [
  { key: "claude-fable-5-1", label: "Claude Fable 5.1", provider: "anthropic", id: "claude-fable-5-1", effort: "high" },
  { key: "claude-opus-5-5", label: "Claude Opus 5.5", provider: "anthropic", id: "claude-opus-5-5", effort: "high" },
  { key: "claude-sonnet-5-5", label: "Claude Sonnet 5.5", provider: "anthropic", id: "claude-sonnet-5-5", effort: "high" },
  { key: "claude-haiku-4-5", label: "Claude Haiku 4.5", provider: "anthropic", id: "claude-haiku-4-5" },
  { key: "gpt-5", label: "GPT-5", provider: "openai", id: "gpt-5", effort: "high" },
  { key: "gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "google", id: "gemini-2.5-pro" },
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
    effort: provider === "openrouter" ? undefined : effort,
  };
}
