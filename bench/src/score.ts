import type { Item, Rung, SealedAnswer } from "./items.ts";
import { extractAnswer, isSingleSign } from "./prompts.ts";

export type Score = { score: number; parsed: string | null; detail?: string };

// ---------- identify ----------

const EGYPTIAN = new Set(["hieratic", "abnormal-hieratic", "hieroglyphic", "cursive-hieroglyphic", "demotic", "egyptian"]);

/** Map a free-text script name onto the benchmark's labels. Order matters: most specific first. */
export function classifyScript(answer: string): string {
  const a = answer.toLowerCase();
  if (/^\W*(unknown|none|unidentified|unclear|n\/a)\b/.test(a)) return "unknown";
  // The script claimed for the Book of Mormon, not an Egyptian script.
  if (/reformed\s+egyptian/.test(a)) return "other";
  if (/abnormal\s+hieratic/.test(a)) return "abnormal-hieratic";
  if (/hieratic/.test(a)) return "hieratic";
  if (/demotic/.test(a)) return "demotic";
  if (/cursive\s+hieroglyph/.test(a)) return "cursive-hieroglyphic";
  if (/hieroglyph/.test(a)) return "hieroglyphic";
  if (/coptic/.test(a)) return "coptic";
  if (/egypt/.test(a)) return "egyptian";
  return "other";
}

function sameScript(predicted: string, gold: string): boolean {
  const family = (s: string) =>
    s === "abnormal-hieratic" ? "hieratic" : s === "cursive-hieroglyphic" ? "hieroglyphic" : s;
  return family(predicted) === family(gold);
}

/** 1 for the right script, 0.5 for the wrong Egyptian script, 0 otherwise. */
export function scoreIdentify(response: string, gold: string): Score {
  const parsed = extractAnswer(response, "identify");
  if (parsed === null) return { score: 0, parsed, detail: "no SCRIPT line" };
  const predicted = classifyScript(parsed);
  if (sameScript(predicted, gold)) return { score: 1, parsed, detail: predicted };
  if (EGYPTIAN.has(predicted) && EGYPTIAN.has(gold)) return { score: 0.5, parsed, detail: predicted };
  return { score: 0, parsed, detail: predicted };
}

// ---------- signs ----------

const GARDINER = /\b(Aa|AA|aa|[A-IK-Za-ik-z])\s?0*(\d{1,3})([A-Za-z]?)\b/g;

/** Pull Gardiner codes out of text and canonicalise them: g017 -> G17, AA1 -> Aa1, n35a -> N35A. */
export function parseGardiner(text: string): string[] {
  const codes: string[] = [];
  for (const m of text.matchAll(GARDINER)) {
    const category = m[1].length === 2 ? "Aa" : m[1].toUpperCase();
    codes.push(`${category}${Number(m[2])}${m[3].toUpperCase()}`);
  }
  return codes;
}

export function scoreSign(response: string, gold: string[]): Score {
  const parsed = extractAnswer(response, "signs");
  const first = parsed ? parseGardiner(parsed)[0] : undefined;
  if (!first) return { score: 0, parsed, detail: "no Gardiner code" };
  const accepted = new Set(gold.flatMap(parseGardiner));
  return { score: accepted.has(first) ? 1 : 0, parsed, detail: first };
}

export function scoreSignSequence(response: string, gold: string[][]): Score {
  const parsed = extractAnswer(response, "signs");
  if (parsed === null) return { score: 0, parsed, detail: "no SIGNS line" };
  const predicted = parseGardiner(parsed);
  const best = Math.max(
    ...gold.map((g) => {
      const reference = g.flatMap(parseGardiner);
      return 1 - editDistance(predicted, reference) / reference.length;
    }),
  );
  return { score: Math.max(0, best), parsed };
}

// ---------- transliterate ----------

/**
 * Reduce Egyptological transliteration (Unicode or Manuel de Codage) to one
 * consonantal skeleton, so conventions don't cost points: j/i/ỉ/i̯ -> i, z -> s,
 * and word separators, morpheme dots and spaces are dropped.
 */
export function canonicalTransliteration(text: string): string {
  // Plain ASCII is Manuel de Codage, where case is meaningful (A = ꜣ, a = ꜥ, H = ḥ, ...).
  // Capitals with no MdC meaning are just capitalised names.
  if (/^[\x00-\x7f]*$/.test(text)) {
    return text
      .replace(/[BCEFGIJKLMNOPQRUVWYZ]/g, (c) => c.toLowerCase())
      .replace(/3/g, "A")
      .replace(/j/g, "i")
      .replace(/z/g, "s")
      .replace(/[^A-Za-z]/g, "");
  }
  return text
    .normalize("NFD")
    .toLowerCase()
    .replace(/ḥ/g, "H") // ḥ
    .replace(/ḫ/g, "x") // ḫ
    .replace(/ẖ/g, "X") // ẖ
    .replace(/š/g, "S") // š
    .replace(/ṯ/g, "T") // ṯ
    .replace(/ḏ/g, "D") // ḏ
    .replace(/ḳ/g, "q") // ḳ
    .replace(/\p{M}/gu, "")
    .replace(/[ꜣȝ3]/g, "A")
    .replace(/[ꜥʿʕˁ]/g, "a")
    .replace(/[ıj]/g, "i")
    .replace(/z/g, "s")
    .replace(/[^A-Za-z]/g, "");
}

export function scoreTransliteration(response: string, gold: string[]): Score {
  const parsed = extractAnswer(response, "transliterate");
  if (parsed === null) return { score: 0, parsed, detail: "no TRANSLITERATION line" };
  const predicted = [...canonicalTransliteration(parsed)];
  const best = Math.max(
    ...gold.map((g) => {
      const reference = [...canonicalTransliteration(g)];
      return 1 - editDistance(predicted, reference) / reference.length;
    }),
  );
  return { score: Math.max(0, best), parsed };
}

// ---------- translate ----------

function charNgrams(text: string, n: number): Map<string, number> {
  const counts = new Map<string, number>();
  for (let i = 0; i + n <= text.length; i++) {
    const gram = text.slice(i, i + n);
    counts.set(gram, (counts.get(gram) ?? 0) + 1);
  }
  return counts;
}

/** chrF (Popović 2015): character n-grams up to 6, beta 2, whitespace ignored, case-insensitive. */
export function chrF(hypothesis: string, reference: string, maxN = 6, beta = 2): number {
  const hyp = hypothesis.toLowerCase().replace(/\s+/g, "");
  const ref = reference.toLowerCase().replace(/\s+/g, "");
  let precision = 0;
  let recall = 0;
  let orders = 0;
  for (let n = 1; n <= maxN; n++) {
    const h = charNgrams(hyp, n);
    const r = charNgrams(ref, n);
    const hTotal = Math.max(0, hyp.length - n + 1);
    const rTotal = Math.max(0, ref.length - n + 1);
    if (hTotal === 0 || rTotal === 0) continue;
    let overlap = 0;
    for (const [gram, count] of h) overlap += Math.min(count, r.get(gram) ?? 0);
    precision += overlap / hTotal;
    recall += overlap / rTotal;
    orders++;
  }
  if (orders === 0) return 0;
  precision /= orders;
  recall /= orders;
  if (precision + recall === 0) return 0;
  return ((1 + beta ** 2) * precision * recall) / (beta ** 2 * precision + recall);
}

export function scoreTranslation(response: string, gold: string[]): Score {
  const parsed = extractAnswer(response, "translate");
  if (parsed === null) return { score: 0, parsed, detail: "no TRANSLATION line" };
  return { score: Math.max(...gold.map((g) => chrF(parsed, g))), parsed };
}

// ---------- dispatch ----------

export function editDistance<T>(a: T[], b: T[]): number {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return row[b.length];
}

/** Score one response, or return null when the gold answer isn't available on this machine. */
export function scoreResponse(
  item: Item,
  rung: Rung,
  response: string,
  sealed: SealedAnswer | undefined,
): Score | null {
  switch (rung) {
    case "identify":
      return item.script ? scoreIdentify(response, item.script) : null;
    case "signs":
      if (isSingleSign(item)) return scoreSign(response, item.gardiner!);
      return sealed?.signs ? scoreSignSequence(response, sealed.signs) : null;
    case "transliterate":
      return sealed?.transliteration ? scoreTransliteration(response, sealed.transliteration) : null;
    case "translate":
      return sealed?.translation ? scoreTranslation(response, sealed.translation) : null;
  }
}
