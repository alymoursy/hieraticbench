// Pure display helpers with no data import, safe to use in client components.
import type { Item, Rung } from "./data";

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

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-10-04" -> "4 October 2026", "2026-09" -> "September 2026". Parsed by hand so time zones can't shift the day. */
export function formatDate(value: string): string {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return [day, MONTHS[month - 1], year].filter(Boolean).join(" ");
}

export const times = (n: number) => (n === 1 ? "once" : n === 2 ? "twice" : `${n} times`);
