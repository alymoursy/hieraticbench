import board from "@/generated/leaderboard.json";

export const RUNGS = ["identify", "signs", "transliterate", "translate"] as const;
export type Rung = (typeof RUNGS)[number];

export type RungResult = { score: number; items: number; coverage: number; samples: number };

export type Entry = {
  key: string;
  label: string;
  provider: string;
  modelId: string;
  effort?: string;
  rungs: Partial<Record<Rung, RungResult>>;
  overall: number | null;
  refusals: number;
  lastRun: string;
};

export type Item = {
  id: string;
  title: string;
  split: "public" | "sealed";
  rungs: Rung[];
  image: string;
  script?: string;
  famous: boolean;
  object: Partial<Record<"name" | "date" | "period" | "material" | "holder" | "content", string>>;
  source: { url?: string; license: string; licenseUrl?: string; attribution?: string };
};

export type Spotcheck = {
  id: string;
  model: string;
  date: string;
  surface: string;
  item: string;
  prompt: string;
  quote: string | null;
  detail?: string;
  reading: string | null;
  verdict: string;
};

export type Leaderboard = {
  harness: string;
  generatedAt: string;
  dataset: {
    items: number;
    sealed: number;
    byRung: Partial<Record<Rung, number>>;
    byScript: Record<string, number>;
    bySource: Record<string, number>;
  };
  entries: Entry[];
  perItem: Record<string, Record<string, Partial<Record<Rung, number>>>>;
  spotchecks: Spotcheck[];
  sentenceGuesses: { model: string; tries: number; answers: { answer: string; count: number }[] }[];
  prompts: Record<"identify" | "signsSingle" | "signsSequence" | "transliterate" | "translate", string>;
  items: Item[];
};

export const leaderboard = board as unknown as Leaderboard;

export const SCRIPT_LABEL: Record<string, string> = {
  hieratic: "Hieratic",
  "abnormal-hieratic": "Abnormal hieratic",
  hieroglyphic: "Hieroglyphic",
  "cursive-hieroglyphic": "Cursive hieroglyphs",
  demotic: "Demotic",
  coptic: "Coptic",
  other: "Other",
};

export const RUNG_LABEL: Record<Rung, string> = {
  identify: "Identify",
  signs: "Signs",
  transliterate: "Transliterate",
  translate: "Translate",
};

export function percent(score: number): string {
  const value = score * 100;
  return `${value < 10 && value > 0 ? value.toFixed(1) : Math.round(value)}%`;
}

export const thumbUrl = (item: Item) => `/data/thumb/${item.id}.webp`;
export const largeUrl = (item: Item) => `/data/large/${item.id}.webp`;

/** Mean identify score on the sealed sentences, per leaderboard row. */
export function sentenceScore(entryKey: string): number | null {
  const scores = leaderboard.items
    .filter((i) => i.split === "sealed")
    .map((i) => leaderboard.perItem[i.id]?.[entryKey]?.identify)
    .filter((s): s is number => typeof s === "number");
  return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
}

/** Mean identify score on public items of one kind, per leaderboard row. */
export function identifyScore(entryKey: string, kind: "hieratic" | "control" | "all"): number | null {
  const scores = leaderboard.items
    .filter((i) => i.split === "public" && i.rungs.includes("identify"))
    .filter((i) => {
      const hieratic = i.script === "hieratic" || i.script === "abnormal-hieratic";
      return kind === "all" || (kind === "hieratic") === hieratic;
    })
    .map((i) => leaderboard.perItem[i.id]?.[entryKey]?.identify)
    .filter((s): s is number => typeof s === "number");
  return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
}

/** The best value of a per-row metric across the leaderboard. */
export function best(metric: (entryKey: string) => number | null | undefined): number | null {
  const values = leaderboard.entries.map((e) => metric(e.key)).filter((v): v is number => typeof v === "number");
  return values.length ? Math.max(...values) : null;
}

/** How many leaderboard rows named this item's script correctly (score 1). */
export function identifiedBy(item: Item): { right: number; asked: number } {
  const results = Object.values(leaderboard.perItem[item.id] ?? {})
    .map((r) => r.identify)
    .filter((s): s is number => typeof s === "number");
  return { right: results.filter((s) => s >= 0.999).length, asked: results.length };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-10-04" -> "4 October 2026", "2026-09" -> "September 2026". Parsed by hand so time zones can't shift the day. */
export function formatDate(value: string): string {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return [day, MONTHS[month - 1], year].filter(Boolean).join(" ");
}

export const times = (n: number) => (n === 1 ? "once" : n === 2 ? "twice" : `${n} times`);
