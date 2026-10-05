import { Container } from "@/components/Container";
import { largeUrl, leaderboard } from "@/lib/data";

export function Hieratic() {
  // The Prisse Papyrus: black ink with red headings, the scribal habit this site's red comes from.
  const papyrus =
    leaderboard.items.find((i) => i.id === "wm-0004") ??
    leaderboard.items.find((i) => i.rungs.includes("identify") && i.famous && i.script === "hieratic") ??
    leaderboard.items.find((i) => i.id === "hb-0002")!;
  return (
    <section id="hieratic" className="border-t border-black/5 py-24 sm:py-32">
      <Container className="grid items-start gap-16 lg:grid-cols-2">
        <div>
          <h2 className="max-w-[20ch] text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            Hieroglyphs were for stone. Hieratic was for everything else.
          </h2>
          <div className="mt-8 flex flex-col gap-5 text-lg/8 text-pretty text-stone-700">
            <p className="max-w-[60ch]">
              Hieratic is the cursive form of Egyptian hieroglyphs, written fast with a reed brush on papyrus, pottery
              shards and wooden boards. For more than three thousand years it was how Egypt actually wrote. Letters,
              tax records, medical manuals, maths problems, love poems, the stories people told.
            </p>
            <p className="max-w-[60ch]">
              The Rhind Mathematical Papyrus is hieratic. So is the Edwin Smith surgical papyrus, the Tale of Sinuhe,
              and the Diary of Merer, a logbook kept during the building of the Great Pyramid and the oldest inscribed
              papyrus ever found.
            </p>
            <p className="max-w-[60ch]">
              Hieroglyphs get the museum walls. Hieratic is where the people are. And almost nobody alive can read it.
            </p>
          </div>
        </div>
        <figure className="flex flex-col gap-3 lg:pt-3">
          <div className="overflow-hidden rounded-2xl bg-stone-50 outline-1 -outline-offset-1 outline-black/5">
            <img src={largeUrl(papyrus)} alt={`${papyrus.title}, written in hieratic.`} className="w-full" />
          </div>
          <figcaption className="text-base text-stone-600 sm:text-sm/6">
            {papyrus.title}
            {papyrus.object.date ? `, ${papyrus.object.date}` : ""}.{" "}
            {papyrus.id === "wm-0004" ? "Scribes wrote headings in red ochre. The red on this site comes from them. " : ""}
            {papyrus.source.attribution ? `${papyrus.source.attribution}. ` : ""}
            {papyrus.source.license.replace(/\.$/, "")}.
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
