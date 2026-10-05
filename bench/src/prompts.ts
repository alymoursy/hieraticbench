import type { Item, Rung } from "./items.ts";

// Identify is asked cold, the way a curious person would ask. Every other rung
// tells the model it is looking at hieratic, so failing to recognise the script
// doesn't sink the reading rungs.
const HINT =
  "This image shows Egyptian hieratic, the cursive script of ancient Egypt, written with a reed brush or pen.";

// Format only. A real example code would hint at the answer for any item whose gold it happens to be.
const CODE_FORMAT = "(category letters followed by a number, no spaces inside a code)";

export const ANSWER_LABEL: Record<Rung, string> = {
  identify: "SCRIPT",
  signs: "SIGNS",
  transliterate: "TRANSLITERATION",
  translate: "TRANSLATION",
};

export function isSingleSign(item: Item): boolean {
  return Array.isArray(item.gardiner);
}

export function buildPrompt(item: Item, rung: Rung): string {
  switch (rung) {
    case "identify":
      return [
        "Can you identify and translate this script?",
        "",
        "Finish your answer with one final line in exactly this format:",
        "SCRIPT: <the name of the writing system, or UNKNOWN>",
      ].join("\n");
    case "signs":
      if (isSingleSign(item)) {
        return [
          `${HINT} It contains a single sign.`,
          `Which hieroglyph does this hieratic sign correspond to? Give its code in Gardiner's sign list ${CODE_FORMAT}.`,
          "",
          "Finish your answer with one final line in exactly this format:",
          "SIGNS: <one Gardiner code>",
        ].join("\n");
      }
      return [
        HINT,
        `Transcribe it sign by sign into hieroglyphs, in reading order, using codes from Gardiner's sign list ${CODE_FORMAT}.`,
        "",
        "Finish your answer with one final line in exactly this format:",
        "SIGNS: <Gardiner codes separated by spaces>",
      ].join("\n");
    case "transliterate":
      return [
        HINT,
        "Transliterate the text into standard Egyptological transliteration, in Unicode (ꜣ, ꜥ, ḥ, ḫ, ẖ, š, ḳ, ṯ, ḏ and so on).",
        "",
        "Finish your answer with one final line in exactly this format:",
        "TRANSLITERATION: <your transliteration>",
      ].join("\n");
    case "translate":
      return [
        HINT,
        "Translate the text into English.",
        "",
        "Finish your answer with one final line in exactly this format:",
        "TRANSLATION: <your English translation>",
      ].join("\n");
  }
}

/** The content of the last `LABEL: ...` line, tolerating markdown emphasis and code ticks. */
export function extractAnswer(response: string, rung: Rung): string | null {
  const label = ANSWER_LABEL[rung];
  const pattern = new RegExp(`^[\\s>*_\`#-]*${label}[*_\`]*\\s*:\\s*(.*)$`, "i");
  const lines = response.split(/\r?\n/);
  for (let i = lines.length - 1; i >= 0; i--) {
    const match = lines[i].match(pattern);
    if (match) {
      const answer = match[1].replace(/[*_`]+/g, "").trim();
      return answer.length > 0 ? answer : null;
    }
  }
  return null;
}
