import { Arrow } from "@/components/Arrow";
import { Container } from "@/components/Container";
import { ItemTile } from "@/components/ItemTile";
import { leaderboard, type Item } from "@/lib/data";

// A hand-picked spread: both sealed sentences, famous papyri, an ostracon, a single sign and two controls.
const FEATURED = ["hb-0001", "hb-0002", "wm-0007", "met-0025", "wm-0013", "wm-0039", "met-0032", "aku-0003"];

function pick(items: Item[], count: number): Item[] {
  const featured = FEATURED.flatMap((id) => items.filter((i) => i.id === id));
  const rest = items.filter((i) => !FEATURED.includes(i.id));
  return [...featured, ...rest].slice(0, count);
}

export function DatasetPreview() {
  const { dataset, items } = leaderboard;
  const publicIdentify = items.filter((i) => i.split === "public" && i.rungs.includes("identify"));
  const isHieratic = (i: Item) => i.script === "hieratic" || i.script === "abnormal-hieratic";
  const documents = publicIdentify.filter(isHieratic).length;
  const controls = publicIdentify.length - documents;
  const signs = items.filter((i) => i.split === "public" && i.rungs.includes("signs")).length;
  const parts = [
    documents && `${documents} real hieratic documents`,
    controls && `${controls} controls in other Egyptian scripts`,
    signs && `${signs} single signs`,
    `${dataset.sealed} sealed sentences`,
  ].filter(Boolean) as string[];
  const summary = parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}` : parts[0];
  return (
    <section id="dataset" className="border-t border-black/5 py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">The dataset</h2>
            <p className="mt-6 max-w-[56ch] text-lg/8 text-pretty text-stone-600">
              {dataset.items} items. {summary}. Every public image is openly licensed and credited.
            </p>
          </div>
          <a href="/dataset/" className="flex shrink-0 items-center gap-2 text-lg text-ink hover:text-rubric">
            Browse every item <Arrow />
          </a>
        </div>
        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {pick(items, 8).map((item) => (
            <ItemTile key={item.id} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
