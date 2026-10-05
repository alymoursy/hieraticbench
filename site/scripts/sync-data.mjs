// Copies the leaderboard into the app and writes web-sized images for every item.
// Runs before `next dev` and `next build`; the output is gitignored.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.resolve(site, "..");

const board = JSON.parse(fs.readFileSync(path.join(root, "results", "leaderboard.json"), "utf8"));

const generated = path.join(site, "src", "generated");
fs.mkdirSync(generated, { recursive: true });
fs.writeFileSync(path.join(generated, "leaderboard.json"), JSON.stringify(board));

// The evaluation images are up to 2000 px. The site only needs a thumbnail for
// the grids and a larger copy for the one image shown big.
const out = path.join(site, "public", "data");
const sizes = { thumb: 640, large: 1600 };
for (const dir of Object.keys(sizes)) fs.mkdirSync(path.join(out, dir), { recursive: true });

let written = 0;
for (const item of board.items) {
  const source = path.join(root, "data", item.image);
  for (const [dir, width] of Object.entries(sizes)) {
    const target = path.join(out, dir, `${item.id}.webp`);
    if (fs.existsSync(target) && fs.statSync(target).mtimeMs > fs.statSync(source).mtimeMs) continue;
    await sharp(source)
      .flatten({ background: "#ffffff" })
      .resize({ width, height: width, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(target);
    written++;
  }
}
console.log(`synced ${board.entries.length} leaderboard rows, ${board.items.length} items (${written} images written)`);
