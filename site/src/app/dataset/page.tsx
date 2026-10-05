import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ItemTile } from "@/components/ItemTile";
import { SCRIPT_LABEL, leaderboard, type Item } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dataset",
  description: "Every item in HieraticBench, with its source, date and license.",
};

function Group({ title, note, items }: { title: string; note: string; items: Item[] }) {
  if (items.length === 0) return null;
  return (
    <section className="border-t border-black/5 py-16">
      <h2 className="text-3xl font-medium tracking-tight">
        {title} <span className="text-stone-400 tabular-nums">{items.length}</span>
      </h2>
      <p className="mt-4 max-w-[60ch] text-lg/8 text-pretty text-stone-600">{note}</p>
      <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <ItemTile key={item.id} item={item} showResults />
        ))}
      </div>
    </section>
  );
}

export default function DatasetPage() {
  const { items } = leaderboard;
  const sealed = items.filter((i) => i.split === "sealed");
  const identify = items.filter((i) => i.split === "public" && i.rungs.includes("identify"));
  const signs = items.filter((i) => i.split === "public" && i.rungs.includes("signs"));
  const scripts = [...new Set(identify.map((i) => i.script ?? "other"))].sort((a, b) =>
    a === "hieratic" ? -1 : b === "hieratic" ? 1 : a.localeCompare(b),
  );
  return (
    <Container className="pt-16 pb-24 sm:pt-24">
      <h1 className="max-w-[20ch] text-5xl font-medium tracking-tight text-balance sm:text-6xl">The dataset</h1>
      <p className="mt-6 max-w-[56ch] text-xl/8 text-pretty text-stone-600">
        {items.length} items. The sealed sentences carry the whole ladder. The public set tests whether a model can
        name what it is looking at, with controls that look like hieratic but aren&apos;t.
      </p>
      <p className="mt-6 mb-16 max-w-[68ch] text-base/7 text-pretty text-stone-600 sm:text-sm/6">
        Single signs come from{" "}
        <a href="https://aku-pal.uni-mainz.de" className="underline decoration-stone-300 hover:decoration-rubric">
          AKU-PAL
        </a>
        , the hieratic palaeography of the Academy of Sciences and Literature, Mainz, under CC BY 4.0. Objects come from
        The Metropolitan Museum of Art, Chester Beatty in Dublin, the Yale Peabody Museum and Wikimedia Commons. Every
        item links to its source and keeps the license the source states.
      </p>
      <Group
        title="Sealed sentences"
        note="One sentence in two hands, commissioned in 2022. The script is public. The signs, transliteration and translation are held privately and have never been published."
        items={sealed}
      />
      {scripts.map((script) => (
        <Group
          key={script}
          title={SCRIPT_LABEL[script] ?? script}
          note={
            script === "hieratic" || script === "abnormal-hieratic"
              ? "Real documents in hieratic, from openly licensed photographs and facsimiles. Scored on the identify rung."
              : "Controls. Real Egyptian writing that is not hieratic, so a model that always answers hieratic loses points."
          }
          items={identify.filter((i) => (i.script ?? "other") === script)}
        />
      ))}
      <Group
        title="Single signs"
        note="One hieratic sign per image. The model names the matching hieroglyph by its Gardiner code."
        items={signs}
      />
    </Container>
  );
}
