import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { DatasetBrowser, type Group } from "@/components/DatasetBrowser";
import { identifiedBy, leaderboard, type Item } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dataset",
  description: "Every item in HieraticBench, with its source, date and license.",
};

const isHieratic = (i: Item) => i.script === "hieratic" || i.script === "abnormal-hieratic";

export default function DatasetPage() {
  const { items } = leaderboard;
  const withResults = (list: Item[]) => list.map((item) => ({ ...item, results: identifiedBy(item) }));
  const identify = items.filter((i) => i.split === "public" && i.rungs.includes("identify"));
  const groups: Group[] = [
    {
      key: "sealed",
      label: "Sealed",
      note: "One sentence in two hands, commissioned in 2022. The script is public. The signs, transliteration and translation are held privately and have never been published.",
      items: withResults(items.filter((i) => i.split === "sealed")),
    },
    {
      key: "hieratic",
      label: "Hieratic",
      note: "Real documents in hieratic, from openly licensed photographs and facsimiles. Scored on the identify rung.",
      items: withResults(identify.filter(isHieratic)),
    },
    {
      key: "controls",
      label: "Controls",
      note: "Real Egyptian writing that is not hieratic, in demotic and hieroglyphs, so a model that always answers hieratic loses points.",
      items: withResults(identify.filter((i) => !isHieratic(i))),
    },
    {
      key: "signs",
      label: "Single signs",
      note: "One hieratic sign per image. The model names the matching hieroglyph by its Gardiner code. The codes are kept off this page.",
      items: withResults(items.filter((i) => i.split === "public" && i.rungs.includes("signs"))),
      compact: true,
    },
  ].filter((g) => g.items.length > 0);

  return (
    <Container className="pt-16 pb-24 sm:pt-24">
      <h1 className="max-w-[20ch] text-5xl font-medium tracking-tight text-balance sm:text-6xl">The dataset</h1>
      <p className="mt-6 max-w-[56ch] text-xl/8 text-pretty text-stone-600">
        {items.length} items. The sealed sentences carry the whole ladder. The public set tests whether a model can
        name what it is looking at, with controls that look like hieratic but aren&apos;t.
      </p>
      <p className="mt-6 mb-14 max-w-[68ch] text-base/7 text-pretty text-stone-600 sm:text-sm/6">
        Single signs come from{" "}
        <a href="https://aku-pal.uni-mainz.de" className="underline decoration-stone-300 hover:decoration-rubric">
          AKU-PAL
        </a>
        , the hieratic palaeography of the Academy of Sciences and Literature, Mainz, under CC BY 4.0. Objects come from
        The Metropolitan Museum of Art, Chester Beatty in Dublin, the Yale Peabody Museum and Wikimedia Commons. Every
        item links to its source and keeps the license the source states.
      </p>
      <DatasetBrowser groups={groups} />
    </Container>
  );
}
