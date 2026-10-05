import fs from "node:fs";
import path from "node:path";
import { DATA, RUNGS, loadItems } from "./items.ts";
import { RUNS_DIR, listJsonl, readRecords } from "./runs.ts";

// What CI checks on every pull request, so contributions can be merged without a
// maintainer re-deriving any of this by hand.

const OPEN_LICENSE = /^(public domain|cc0|cc by(-sa)? \d|cc by(-sa)?$|cc by 4\.0|cc by-sa \d)/i;
const CLOSED_LICENSE = /\b(nc|nd|non-?commercial|no ?derivatives)\b/i;
const MAX_IMAGE_BYTES = 3_000_000;

export function validate(): string[] {
  const problems: string[] = [];
  const items = loadItems();
  const byId = new Map(items.map((i) => [i.id, i]));

  for (const item of items) {
    const where = `data/items/${item.id}.json`;
    const file = path.join(DATA, "items", `${item.id}.json`);
    if (!fs.existsSync(file)) problems.push(`${where}: id does not match the file name`);
    for (const field of ["id", "split", "rungs", "image", "title", "source"] as const) {
      if (!item[field]) problems.push(`${where}: missing ${field}`);
    }
    if (!["public", "sealed"].includes(item.split)) problems.push(`${where}: split must be public or sealed`);
    for (const rung of item.rungs ?? []) {
      if (!RUNGS.includes(rung)) problems.push(`${where}: unknown rung ${rung}`);
    }
    const image = path.join(DATA, item.image ?? "");
    if (!item.image || !fs.existsSync(image)) problems.push(`${where}: image ${item.image} not found`);
    else if (fs.statSync(image).size > MAX_IMAGE_BYTES) problems.push(`${where}: image over 3 MB, resize per data/SCHEMA.md`);
    if (item.rungs?.includes("identify") && !item.script) problems.push(`${where}: identify needs a gold script`);
    if (item.split === "public" && item.rungs?.includes("signs") && !item.gardiner?.length) {
      problems.push(`${where}: a public signs item needs gardiner codes`);
    }
    if (item.split === "public") {
      const license = item.source?.license ?? "";
      if (!OPEN_LICENSE.test(license.trim()) || CLOSED_LICENSE.test(license)) {
        problems.push(`${where}: license "${license}" is not public domain, CC0, CC BY or CC BY-SA`);
      }
      if (!item.source?.url) problems.push(`${where}: public items need source.url`);
    }
  }

  for (const file of listJsonl(RUNS_DIR)) {
    const where = path.relative(path.dirname(RUNS_DIR), file);
    readRecords(file).forEach((r, line) => {
      const item = byId.get(r.itemId);
      if (!item) return problems.push(`${where}:${line + 1}: unknown item ${r.itemId}`);
      if (!r.model?.key || !r.rung || r.createdAt === undefined) problems.push(`${where}:${line + 1}: incomplete record`);
      if (r.score !== null && (r.score < 0 || r.score > 1)) problems.push(`${where}:${line + 1}: score out of range`);
      if (r.privateCopy) problems.push(`${where}:${line + 1}: private copy in a public file`);
      // The rule that protects the answer key: no answer text on a sealed item in public results.
      if (item.split === "sealed" && r.response) {
        problems.push(`${where}:${line + 1}: answer text for sealed item ${r.itemId}. Sealed answers go to results/inbox and are emailed, never committed`);
      }
    });
  }

  return problems;
}
