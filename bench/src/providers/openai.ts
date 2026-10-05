import OpenAI from "openai";
import type { ModelSpec } from "../models.ts";
import type { Completion, Image } from "./index.ts";

let openai: OpenAI | undefined;
let openrouter: OpenAI | undefined;

export async function askOpenAI(model: ModelSpec, image: Image, prompt: string): Promise<Completion> {
  openai ??= new OpenAI();
  const response = await openai.responses.create({
    model: model.id,
    ...(model.effort ? { reasoning: { effort: model.effort === "xhigh" || model.effort === "max" ? "high" : model.effort } } : {}),
    input: [
      {
        role: "user",
        content: [
          { type: "input_image", image_url: `data:${image.mediaType};base64,${image.data}`, detail: "high" },
          { type: "input_text", text: prompt },
        ],
      },
    ],
  });
  return {
    text: response.output_text,
    stopReason: response.status ?? undefined,
    usage: { inputTokens: response.usage?.input_tokens, outputTokens: response.usage?.output_tokens },
  };
}

// For open-weight and other labs' models through one key. Claude models should
// go through the anthropic provider instead.
export async function askOpenRouter(model: ModelSpec, image: Image, prompt: string): Promise<Completion> {
  openrouter ??= new OpenAI({ apiKey: process.env.OPENROUTER_API_KEY, baseURL: "https://openrouter.ai/api/v1" });
  const response = await openrouter.chat.completions.create({
    model: model.id,
    // OpenRouter extensions: unified reasoning effort, and the real cost of each call.
    ...({
      ...(model.effort ? { reasoning: { effort: model.effort === "xhigh" || model.effort === "max" ? "high" : model.effort } } : {}),
      usage: { include: true },
    } as object),
    messages: [
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: `data:${image.mediaType};base64,${image.data}` } },
          { type: "text", text: prompt },
        ],
      },
    ],
  });
  const choice = response.choices[0];
  return {
    text: choice?.message?.content ?? "",
    stopReason: choice?.finish_reason ?? undefined,
    refusal: Boolean(choice?.message?.refusal),
    usage: {
      inputTokens: response.usage?.prompt_tokens,
      outputTokens: response.usage?.completion_tokens,
      costUsd: (response.usage as { cost?: number } | undefined)?.cost,
    },
  };
}
