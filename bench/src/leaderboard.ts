import fs from "node:fs";
import path from "node:path";
import { RESULTS, RUNGS, loadItems, type Item, type Rung } from "./items.ts";
import { buildPrompt } from "./prompts.ts";
import { HARNESS_VERSION, INBOX_DIR, RUNS_DIR, entryKey, listJsonl, readRecords, type RunRecord } from "./runs.ts";

type RungResult = { score: number; items: number; coverage: number; samples: number };

export type LeaderboardEntry = {
  key: string;
  label: string;
  provider: string;
  modelId: string;
  effort?: string;
  rungs: Partial<Record<Rung, RungResult>>;
  /** Mean of the four rungs. Present only once every rung has a score. */
  overall: number | null;
  refusals: number;
  lastRun: string;
};

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

export function buildLeaderboard() {
  const items = loadItems();
  const itemsById = new Map(items.map((i) => [i.id, i]));
  const records = listJsonl(RUNS_DIR).flatMap(readRecords);

  // entry -> item -> rung -> sample scores
  const scores = new Map<string, Map<string, Map<Rung, number[]>>>();
  const meta = new Map<string, { record: RunRecord; refusals: number; lastRun: string }>();

  for (const r of records) {
    if (!itemsById.has(r.itemId) || r.score === null) continue;
    const key = entryKey(r.model);
    const m = meta.get(key) ?? { record: r, refusals: 0, lastRun: r.createdAt };
    if (r.refusal) m.refusals++;
    if (r.createdAt > m.lastRun) m.lastRun = r.createdAt;
    meta.set(key, m);

    const byItem = scores.get(key) ?? new Map<string, Map<Rung, number[]>>();
    const byRung = byItem.get(r.itemId) ?? new Map<Rung, number[]>();
    byRung.set(r.rung, [...(byRung.get(r.rung) ?? []), r.score]);
    byItem.set(r.itemId, byRung);
    scores.set(key, byItem);
  }

  const itemsPerRung = Object.fromEntries(
    RUNGS.map((rung) => [rung, items.filter((i) => i.rungs.includes(rung)).length]),
  ) as Record<Rung, number>;

  const perItem: Record<string, Record<string, Partial<Record<Rung, number>>>> = {};
  const entries: LeaderboardEntry[] = [];

  for (const [key, byItem] of scores) {
    const { record, refusals, lastRun } = meta.get(key)!;
    const rungs: LeaderboardEntry["rungs"] = {};
    for (const rung of RUNGS) {
      const itemMeans: number[] = [];
      let samples = 0;
      for (const [itemId, byRung] of byItem) {
        const s = byRung.get(rung);
        if (!s) continue;
        itemMeans.push(mean(s));
        samples += s.length;
        ((perItem[itemId] ??= {})[key] ??= {})[rung] = mean(s);
      }
      if (itemMeans.length > 0) {
        rungs[rung] = {
          score: mean(itemMeans),
          items: itemMeans.length,
          coverage: itemMeans.length / itemsPerRung[rung],
          samples,
        };
      }
    }
    const complete = RUNGS.every((rung) => rungs[rung]);
    entries.push({
      key,
      label: record.model.label + (record.model.effort ? ` (${record.model.effort})` : ""),
      provider: record.model.provider,
      modelId: record.model.id,
      effort: record.model.effort,
      rungs,
      overall: complete ? mean(RUNGS.map((rung) => rungs[rung]!.score)) : null,
      refusals,
      lastRun,
    });
  }

  entries.sort(
    (a, b) =>
      (b.overall ?? -1) - (a.overall ?? -1) ||
      (b.rungs.identify?.score ?? -1) - (a.rungs.identify?.score ?? -1),
  );

  const spotchecksFile = path.join(RESULTS, "spotchecks.json");
  const spotchecks = fs.existsSync(spotchecksFile) ? JSON.parse(fs.readFileSync(spotchecksFile, "utf8")) : [];

  return {
    harness: HARNESS_VERSION,
    generatedAt: new Date().toISOString(),
    dataset: summarize(items),
    entries,
    perItem,
    spotchecks,
    sentenceGuesses: sentenceGuesses(records, itemsById),
    sealedAnswered: sealedAnswered(),
    prompts: promptsForDocs(),
    items: items.map(publicItem),
  };
}

/**
 * How many sealed answers each row has waiting in the local inbox, per rung, so the
 * site can tell "answered, awaiting the key" apart from "never run". Only the
 * maintainer's machine has the inbox, so rebuild the leaderboard there.
 */
function sealedAnswered() {
  const counts: Record<string, Partial<Record<Rung, number>>> = {};
  for (const r of listJsonl(INBOX_DIR).flatMap(readRecords)) {
    if (r.error || r.privateCopy || r.rung === "identify") continue;
    const row = (counts[entryKey(r.model)] ??= {});
    row[r.rung] = (row[r.rung] ?? 0) + 1;
  }
  return counts;
}

/** What each model named the script of the sealed sentences, with counts. */
function sentenceGuesses(records: RunRecord[], itemsById: Map<string, Item>) {
  const byModel = new Map<string, { label: string; answers: Map<string, number>; tries: number }>();
  for (const r of records) {
    if (r.rung !== "identify" || r.error || itemsById.get(r.itemId)?.split !== "sealed") continue;
    const answer = r.parsed ? r.parsed.replace(/\s*\(.*$/, "").trim() : "No answer";
    const label = answer.toUpperCase() === "UNKNOWN" ? "Unknown" : answer;
    const entry = byModel.get(r.model.label) ?? { label: r.model.label, answers: new Map(), tries: 0 };
    entry.answers.set(label, (entry.answers.get(label) ?? 0) + 1);
    entry.tries++;
    byModel.set(r.model.label, entry);
  }
  return [...byModel.values()].map((e) => ({
    model: e.label,
    tries: e.tries,
    answers: [...e.answers].map(([answer, count]) => ({ answer, count })).sort((a, b) => b.count - a.count),
  }));
}

/** The exact prompts, for the methodology page. */
function promptsForDocs() {
  const sentence = { id: "", split: "sealed", rungs: [], image: "", title: "", source: { license: "" } } as Item;
  const sign = { ...sentence, gardiner: ["G17"] } as Item;
  return {
    identify: buildPrompt(sentence, "identify"),
    signsSingle: buildPrompt(sign, "signs"),
    signsSequence: buildPrompt(sentence, "signs"),
    transliterate: buildPrompt(sentence, "transliterate"),
    translate: buildPrompt(sentence, "translate"),
  };
}

function summarize(items: Item[]) {
  const count = (pick: (i: Item) => string[]) => {
    const out: Record<string, number> = {};
    for (const i of items) for (const k of pick(i)) out[k] = (out[k] ?? 0) + 1;
    return out;
  };
  return {
    items: items.length,
    sealed: items.filter((i) => i.split === "sealed").length,
    byRung: count((i) => i.rungs),
    byScript: count((i) => (i.script ? [i.script] : [])),
    bySource: count((i) => [i.id.split("-")[0]]),
  };
}

/** What the website may show about an item. Gold sign codes stay out of the bundle. */
function publicItem(i: Item) {
  return {
    id: i.id,
    title: i.title,
    split: i.split,
    rungs: i.rungs,
    image: i.image,
    script: i.script,
    famous: i.famous ?? false,
    object: i.object ?? {},
    source: {
      url: i.source.url,
      license: i.source.license,
      licenseUrl: i.source.licenseUrl,
      attribution: i.source.attribution,
    },
  };
}
