import { GoogleGenAI } from "@google/genai";
import type { ModelSpec } from "../models.ts";
import type { Completion, Image } from "./index.ts";

let client: GoogleGenAI | undefined;

export async function askGoogle(model: ModelSpec, image: Image, prompt: string): Promise<Completion> {
  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY });
  const response = await client.models.generateContent({
    model: model.id,
    contents: [
      {
        role: "user",
        parts: [{ inlineData: { mimeType: image.mediaType, data: image.data } }, { text: prompt }],
      },
    ],
  });
  const finishReason = response.candidates?.[0]?.finishReason;
  return {
    text: response.text ?? "",
    stopReason: finishReason ?? undefined,
    refusal: finishReason === "SAFETY" || finishReason === "PROHIBITED_CONTENT",
    usage: {
      inputTokens: response.usageMetadata?.promptTokenCount,
      outputTokens: response.usageMetadata?.candidatesTokenCount,
    },
  };
}
