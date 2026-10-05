import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { ModelSpec } from "../models.ts";
import { askAnthropic } from "./anthropic.ts";
import { askGoogle } from "./google.ts";
import { askOpenAI, askOpenRouter } from "./openai.ts";

export type Image = { data: string; mediaType: "image/png" | "image/jpeg" };

export type Completion = {
  text: string;
  stopReason?: string;
  refusal?: boolean;
  usage?: { inputTokens?: number; outputTokens?: number; costUsd?: number };
};

export function ask(model: ModelSpec, image: Image, prompt: string): Promise<Completion> {
  switch (model.provider) {
    case "anthropic":
      return askAnthropic(model, image, prompt);
    case "openai":
      return askOpenAI(model, image, prompt);
    case "openrouter":
      return askOpenRouter(model, image, prompt);
    case "google":
      return askGoogle(model, image, prompt);
  }
}

const KEYS: Record<ModelSpec["provider"], string[]> = {
  anthropic: ["ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN", "ANTHROPIC_PROFILE"],
  openai: ["OPENAI_API_KEY"],
  google: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
  openrouter: ["OPENROUTER_API_KEY"],
};

export function missingCredentials(model: ModelSpec): string | null {
  const names = KEYS[model.provider];
  if (names.some((n) => process.env[n])) return null;
  // The Anthropic SDK also reads a profile saved by `ant auth login`.
  if (model.provider === "anthropic" && hasAnthropicProfile()) return null;
  return names[0];
}

function hasAnthropicProfile(): boolean {
  const dir = path.join(os.homedir(), ".config", "anthropic", "credentials");
  return fs.existsSync(dir) && fs.readdirSync(dir).some((f) => f.endsWith(".json"));
}
