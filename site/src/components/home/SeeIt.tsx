import { Arrow } from "@/components/Arrow";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

const EVISA_URL = "https://www.veeza.ai/en/egypt-evisa?utm_source=hieraticbench&utm_medium=referral";

const paintings = [
  { src: "/egypt/nile.webp", label: "The Nile" },
  { src: "/egypt/abu-simbel.webp", label: "Abu Simbel" },
];

/** The last step off the page: go and see it in person. Paintings from Veeza's Egypt e-visa page. */
export function SeeIt() {
  return (
    <section className="border-t border-black/5 py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
          <h2 className="max-w-[20ch] text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            Or go see it for yourself.
          </h2>
          <div className="flex flex-col gap-5 text-lg/8 text-pretty text-stone-700 lg:pt-2">
            <p className="max-w-[52ch]">
              Egypt&apos;s museums are full of hieratic, on papyrus and on pottery shards. Deir el-Medina, near Luxor, is
              the village where the workmen who built the royal tombs left thousands of notes in it.
            </p>
            <p className="max-w-[52ch]">Need a visa? {site.company.name} handles the Egypt e-visa before you fly.</p>
            <a
              href={EVISA_URL}
              className="flex items-center gap-2 text-lg text-ink underline decoration-black/20 hover:text-rubric hover:decoration-rubric"
            >
              Get your Egypt e-visa <Arrow />
            </a>
          </div>
        </div>
        <a
          href={EVISA_URL}
          aria-label={`Get your Egypt e-visa with ${site.company.name}`}
          className="group mt-16 grid gap-4 sm:grid-cols-[3fr_2fr]"
        >
          {paintings.map((p) => (
            <figure
              key={p.label}
              className="relative overflow-hidden rounded-2xl outline-1 -outline-offset-1 outline-black/10"
            >
              <img
                src={p.src}
                alt=""
                loading="lazy"
                className="aspect-video w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none sm:aspect-auto sm:h-64 lg:h-72"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/45 to-transparent"
              />
              <figcaption className="pointer-events-none absolute bottom-4 left-5 text-base text-white">{p.label}</figcaption>
            </figure>
          ))}
        </a>
      </Container>
    </section>
  );
}
