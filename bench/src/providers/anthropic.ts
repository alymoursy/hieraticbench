import Anthropic from "@anthropic-ai/sdk";
import type { ModelSpec } from "../models.ts";
import type { Completion, Image } from "./index.ts";

let client: Anthropic | undefined;

// No server-side `fallbacks` here, on purpose: a fallback would quietly answer
// with a different model and the result would be credited to the wrong one.
// A refusal is recorded as a refusal and scores zero.
export async function askAnthropic(model: ModelSpec, image: Image, prompt: string): Promise<Completion> {
  client ??= new Anthropic();
  const message = await client.messages
    .stream({
      model: model.id,
      max_tokens: 64000,
      ...(model.effort ? { output_config: { effort: model.effort } } : {}),
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: image.mediaType, data: image.data } },
            { type: "text", text: prompt },
          ],
        },
      ],
    })
    .finalMessage();

  const text = message.content
    .flatMap((block) => (block.type === "text" ? [block.text] : []))
    .join("\n");
  return {
    text,
    stopReason: message.stop_reason ?? undefined,
    refusal: message.stop_reason === "refusal",
    usage: { inputTokens: message.usage.input_tokens, outputTokens: message.usage.output_tokens },
  };
}
