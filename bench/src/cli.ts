import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { DATA, RESULTS, ROOT, RUNGS, isSealed, loadAnswerKey, loadImage, loadItems, type Item, type Rung } from "./items.ts";
import { buildLeaderboard } from "./leaderboard.ts";
import { MODELS, resolveModel, type Effort, type ModelSpec } from "./models.ts";
import { buildPrompt } from "./prompts.ts";
import { ask, missingCredentials } from "./providers/index.ts";
import { HARNESS_VERSION, INBOX_DIR, RUNS_DIR, appendRecord, entryKey, listJsonl, newRunId, readRecords, type RunRecord } from "./runs.ts";
import { scoreResponse } from "./score.ts";
import { validate } from "./validate.ts";

const HELP = `HieraticBench ${HARNESS_VERSION}

Usage: npm run bench -- <command> [options]

Commands
  run          Ask models to read the benchmark items
  score        Score sealed outputs in results/inbox (needs the private answer key)
  leaderboard  Rebuild results/leaderboard.json from results/runs
  items        Summarise the dataset
  validate     Check items, licenses and results files (CI runs this on every pull request)
  models       List model shortcuts

Options for run
  --models     Comma-separated: ${MODELS.map((m) => m.key).join(", ")}, or provider:model-id
  --rungs      Comma-separated subset of: ${RUNGS.join(", ")} (default: all)
  --items      Comma-separated item ids or id prefixes, e.g. hb-,wm-0001 (default: all)
  --samples    Answers per item and rung (default 1; leaderboard runs use 3)
  --effort     low | medium | high | xhigh | max, for models that support it
  --concurrency  Parallel requests per model (default 4)
  --limit      Stop after this many requests per model (for smoke tests)
  --dry-run    Print the plan and the first prompt without calling any API
  --resume     Skip answers this model already has (same effort), e.g. after an interrupted run
  --max-cost   Stop a model's run once its reported spend reaches this many US dollars (OpenRouter reports cost)
`;

async function main() {
  const envFile = path.join(ROOT, ".env");
  if (fs.existsSync(envFile)) process.loadEnvFile(envFile);
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      models: { type: "string" },
      rungs: { type: "string" },
      items: { type: "string" },
      samples: { type: "string", default: "1" },
      effort: { type: "string" },
      concurrency: { type: "string", default: "4" },
      limit: { type: "string" },
      "dry-run": { type: "boolean", default: false },
      resume: { type: "boolean", default: false },
      "max-cost": { type: "string" },
      help: { type: "boolean", short: "h", default: false },
    },
  });
  const command = positionals[0];
  if (!command || values.help) return console.log(HELP);

  switch (command) {
    case "run":
      return run(values);
    case "score":
      return score();
    case "leaderboard":
      return leaderboard();
    case "items":
      return describeItems();
    case "validate": {
      const problems = validate();
      problems.forEach((p) => console.error(p));
      console.log(problems.length ? `${problems.length} problems` : "All items and results are valid.");
      if (problems.length) process.exitCode = 1;
      return;
    }
    case "models":
      return MODELS.forEach((m) => console.log(`${m.key.padEnd(20)} ${m.provider.padEnd(11)} ${m.id}${m.effort ? `  effort=${m.effort}` : ""}`));
    default:
      console.error(`Unknown command "${command}".\n`);
      console.log(HELP);
      process.exitCode = 1;
  }
}

type Task = { item: Item; rung: Rung; sample: number };

async function run(values: Record<string, string | boolean | undefined>) {
  if (!values.models) throw new Error("Pass --models, e.g. --models claude-opus-5-5");
  const effort = values.effort as Effort | undefined;
  const models = String(values.models).split(",").map((m) => resolveModel(m.trim(), effort));
  const rungs = values.rungs ? (String(values.rungs).split(",") as Rung[]) : [...RUNGS];
  for (const r of rungs) if (!RUNGS.includes(r)) throw new Error(`Unknown rung "${r}"`);
  const filters = values.items ? String(values.items).split(",").map((s) => s.trim()) : null;
  const samples = Number(values.samples);
  const concurrency = Number(values.concurrency);
  const limit = values.limit ? Number(values.limit) : Infinity;
  const maxCost = values["max-cost"] ? Number(values["max-cost"]) : Infinity;

  const items = loadItems().filter((i) => !filters || filters.some((f) => i.id === f || i.id.startsWith(f)));
  const tasks: Task[] = [];
  for (const item of items)
    for (const rung of rungs)
      if (item.rungs.includes(rung))
        for (let sample = 0; sample < samples; sample++) tasks.push({ item, rung, sample });

  const planned = tasks.slice(0, limit);
  console.log(`${planned.length} requests per model across ${new Set(planned.map((t) => t.item.id)).size} items: ${models.map((m) => m.label).join(", ")}`);
  if (values["dry-run"]) {
    const first = planned[0];
    if (first) console.log(`\nFirst prompt (${first.item.id}, ${first.rung}):\n\n${buildPrompt(first.item, first.rung)}`);
    return;
  }

  for (const model of models) {
    const missing = missingCredentials(model);
    if (missing) {
      console.error(`Skipping ${model.label}: set ${missing}.`);
      continue;
    }
    const todo = values.resume ? withoutDone(model, planned) : planned;
    if (todo.length < planned.length) console.log(`${model.label}: ${planned.length - todo.length} already answered, ${todo.length} to go`);
    await runModel(model, todo, concurrency, maxCost);
  }
  console.log("\nNext: npm run bench -- leaderboard");
}

/** Drop tasks this model (at this effort) has already answered without an error. */
function withoutDone(model: ModelSpec, tasks: Task[]): Task[] {
  const key = entryKey(model);
  const done = new Set(
    [...listJsonl(RUNS_DIR), ...listJsonl(INBOX_DIR)]
      .flatMap(readRecords)
      .filter((r) => !r.error && !r.privateCopy && entryKey(r.model) === key)
      .map((r) => `${r.itemId}|${r.rung}|${r.sample}`),
  );
  return tasks.filter((t) => !done.has(`${t.item.id}|${t.rung}|${t.sample}`));
}

async function runModel(model: ModelSpec, tasks: Task[], concurrency: number, maxCost = Infinity) {
  const runId = newRunId(model);
  const openFile = path.join(RUNS_DIR, `${runId}.jsonl`);
  const sealedFile = path.join(INBOX_DIR, `${runId}.jsonl`);
  let done = 0;
  let correct = 0;
  let scored = 0;
  let cost = 0;

  const worker = async (queue: Task[]) => {
    for (let task = queue.shift(); task && cost < maxCost; task = queue.shift()) {
      const { item, rung, sample } = task;
      const prompt = buildPrompt(item, rung);
      const started = Date.now();
      const record: RunRecord = {
        harness: HARNESS_VERSION,
        runId,
        model,
        itemId: item.id,
        rung,
        sample,
        prompt,
        response: "",
        score: null,
        latencyMs: 0,
        createdAt: new Date().toISOString(),
      };
      try {
        const completion = await ask(model, loadImage(item), prompt);
        Object.assign(record, {
          response: completion.text,
          stopReason: completion.stopReason,
          refusal: completion.refusal,
          usage: completion.usage,
        });
        if (!isSealed(item, rung)) {
          const result = scoreResponse(item, rung, completion.text, undefined);
          if (result) {
            Object.assign(record, { score: result.score, parsed: result.parsed, scoreDetail: result.detail });
            scored++;
            correct += result.score;
          }
        }
      } catch (error) {
        record.error = error instanceof Error ? error.message : String(error);
      }
      record.latencyMs = Date.now() - started;
      cost += record.usage?.costUsd ?? 0;
      if (item.split === "sealed" && rung === "identify") {
        // The cold prompt also asks for a translation, so a model that can read the
        // sentence would write the answer here. Publish the score, keep the text private.
        appendRecord(openFile, { ...record, response: "", withheld: true });
        appendRecord(sealedFile, { ...record, privateCopy: true });
      } else {
        appendRecord(isSealed(item, rung) ? sealedFile : openFile, record);
      }
      done++;
      const mark = record.error ? "error" : record.score === null ? "sealed" : record.score.toFixed(2);
      console.log(`[${model.label}] ${done}/${tasks.length} ${item.id} ${rung} -> ${mark}`);
    }
  };

  const queue = [...tasks];
  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, () => worker(queue)));
  if (cost >= maxCost) console.log(`\n${model.label}: stopped at the $${maxCost} cap with ${tasks.length - done} requests left. Rerun with --resume to finish.`);

  console.log(`\n${model.label}: ${scored ? `${((correct / scored) * 100).toFixed(1)}% on ${scored} openly scored answers` : "no openly scored answers"}${cost ? `, $${cost.toFixed(2)}` : ""}`);
  if (fs.existsSync(openFile)) console.log(`  scored results -> ${path.relative(ROOT, openFile)}`);
  if (fs.existsSync(sealedFile)) {
    console.log(`  sealed answers -> ${path.relative(ROOT, sealedFile)}`);
    console.log("  These may contain a correct reading, so they are not committed. Send the file to the maintainers to be scored.");
  }
}

// A sealed response that scores at least this well is withheld from the public
// results, so a good reading doesn't publish the answer key.
const WITHHOLD_AT = 0.5;

function score() {
  const key = loadAnswerKey();
  if (!key) throw new Error("No answer key at data/private/answers.json. Only maintainers can score sealed rungs.");
  const items = new Map(loadItems().map((i) => [i.id, i]));
  const files = listJsonl(INBOX_DIR);
  if (files.length === 0) return console.log("Nothing in results/inbox.");

  for (const file of files) {
    const withheld: RunRecord[] = [];
    const out = path.join(RUNS_DIR, path.basename(file));
    for (const record of readRecords(file)) {
      if (record.privateCopy) {
        withheld.push(record);
        continue;
      }
      const item = items.get(record.itemId);
      if (item && !record.error && record.score === null) {
        const result = scoreResponse(item, record.rung, record.response, key[item.id]);
        if (result) {
          Object.assign(record, { score: result.score, parsed: result.parsed, scoreDetail: result.detail });
          if (result.score >= WITHHOLD_AT) {
            withheld.push({ ...record });
            Object.assign(record, { response: "", parsed: null, withheld: true });
          }
        }
      }
      appendRecord(out, record);
    }
    if (withheld.length) {
      const vault = path.join(DATA, "private", "withheld", path.basename(file));
      withheld.forEach((r) => appendRecord(vault, r));
      console.log(`  ${withheld.length} responses kept private -> ${path.relative(ROOT, vault)}`);
    }
    fs.rmSync(file);
    console.log(`Scored ${path.basename(file)} -> ${path.relative(ROOT, out)}`);
  }
}

function leaderboard() {
  const board = buildLeaderboard();
  const file = path.join(RESULTS, "leaderboard.json");
  fs.writeFileSync(file, JSON.stringify(board, null, 2) + "\n");
  console.log(`${board.entries.length} models, ${board.dataset.items} items -> ${path.relative(ROOT, file)}`);
  for (const e of board.entries) {
    const cells = RUNGS.map((r) => `${r} ${e.rungs[r] ? (e.rungs[r]!.score * 100).toFixed(1) : "-"}`);
    console.log(`  ${e.label.padEnd(28)} ${cells.join("  ")}`);
  }
}

function describeItems() {
  const { dataset } = buildLeaderboard();
  console.log(`${dataset.items} items (${dataset.sealed} sealed)`);
  console.log("by rung:  ", dataset.byRung);
  console.log("by script:", dataset.byScript);
  console.log("by source:", dataset.bySource);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
