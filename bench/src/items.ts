import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, "../..");
export const DATA = path.join(ROOT, "data");
export const RESULTS = path.join(ROOT, "results");

export const RUNGS = ["identify", "signs", "transliterate", "translate"] as const;
export type Rung = (typeof RUNGS)[number];

export type Item = {
  id: string;
  split: "public" | "sealed";
  rungs: Rung[];
  image: string;
  title: string;
  script?: string;
  gardiner?: string[];
  sameTextAs?: string;
  object?: Record<string, string>;
  source: {
    url?: string;
    fileUrl?: string;
    license: string;
    licenseUrl?: string;
    attribution?: string;
    retrieved?: string;
  };
  famous?: boolean;
  notes?: string;
};

export type SealedAnswer = {
  signs?: string[][];
  transliteration?: string[];
  translation?: string[];
};

export function loadItems(): Item[] {
  const dir = path.join(DATA, "items");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Item);
}

export function loadImage(item: Item): { data: string; mediaType: "image/png" | "image/jpeg" } {
  const file = path.join(DATA, item.image);
  const mediaType = file.endsWith(".png") ? "image/png" : "image/jpeg";
  return { data: fs.readFileSync(file).toString("base64"), mediaType };
}

const ANSWER_KEY = path.join(DATA, "private", "answers.json");

/** The sealed answer key, or null on any machine that isn't the maintainer's. */
export function loadAnswerKey(): Record<string, SealedAnswer> | null {
  if (!fs.existsSync(ANSWER_KEY)) return null;
  const raw = JSON.parse(fs.readFileSync(ANSWER_KEY, "utf8")) as Record<
    string,
    SealedAnswer & { sameAs?: string }
  >;
  const key: Record<string, SealedAnswer> = {};
  for (const [id, entry] of Object.entries(raw)) {
    key[id] = entry.sameAs ? raw[entry.sameAs] : entry;
  }
  return key;
}

/** Identify is scored in the open for every item; other rungs on sealed items need the key. */
export function isSealed(item: Item, rung: Rung): boolean {
  return item.split === "sealed" && rung !== "identify";
}
