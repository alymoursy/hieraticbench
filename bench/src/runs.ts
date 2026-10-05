import fs from "node:fs";
import path from "node:path";
import { RESULTS, type Rung } from "./items.ts";
import type { ModelSpec } from "./models.ts";

export const HARNESS_VERSION = "0.1.0";
export const RUNS_DIR = path.join(RESULTS, "runs");
export const INBOX_DIR = path.join(RESULTS, "inbox");

export type RunRecord = {
  harness: string;
  runId: string;
  model: ModelSpec;
  itemId: string;
  rung: Rung;
  sample: number;
  prompt: string;
  response: string;
  parsed?: string | null;
  /** null = not scored yet (sealed rung awaiting the key) or the call failed. */
  score: number | null;
  scoreDetail?: string;
  /** The response text was removed before publishing: any answer on a sealed item's identify rung, or a high-scoring sealed answer. */
  withheld?: boolean;
  /** Full text of a withheld identify answer on a sealed item. Lives only in the inbox and the private vault. */
  privateCopy?: boolean;
  stopReason?: string;
  refusal?: boolean;
  error?: string;
  usage?: { inputTokens?: number; outputTokens?: number; costUsd?: number };
  latencyMs: number;
  createdAt: string;
};

export function readRecords(file: string): RunRecord[] {
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as RunRecord);
}

export function appendRecord(file: string, record: RunRecord): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, JSON.stringify(record) + "\n");
}

export function listJsonl(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".jsonl"))
    .sort()
    .map((f) => path.join(dir, f));
}

export function newRunId(model: ModelSpec): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${stamp}-${model.key}${model.effort ? `-${model.effort}` : ""}-${suffix}`;
}

/** Leaderboard rows are keyed by model and effort: the same model at two efforts is two rows. */
export function entryKey(model: ModelSpec): string {
  return model.effort ? `${model.key}@${model.effort}` : model.key;
}
