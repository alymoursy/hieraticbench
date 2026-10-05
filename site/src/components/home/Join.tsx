import { Arrow } from "@/components/Arrow";
import { Container } from "@/components/Container";
import { mailto, site } from "@/lib/site";

const audiences = [
  {
    who: "Egyptologists",
    ask: "Write us a sentence. Every new sealed sentence makes the benchmark harder to game and the result harder to argue with. Sign annotations on published papyri help just as much.",
    cta: "Offer a sentence",
    href: mailto("I can write a sentence"),
  },
  {
    who: "AI researchers",
    ask: "Run the harness on your model with your own key, or build a reader from scratch. If your model can read the sentence, send us its reading and the people who wrote it will check.",
    cta: "Run the benchmark",
    href: site.github,
  },
  {
    who: "Everyone else",
    ask: "Share it. Introduce us to an Egyptologist. Sponsor a commissioned sentence. The benchmark grows one sentence at a time.",
    cta: "Get in touch",
    href: mailto("I want to help"),
  },
];

export function Join() {
  return (
    <section id="join" className="border-t border-black/5 bg-rubric-wash/50 py-24 sm:py-32">
      <Container>
        <h2 className="max-w-[20ch] text-4xl font-medium tracking-tight text-balance sm:text-5xl">Help AI learn to read hieratic.</h2>
        <p className="mt-6 max-w-[56ch] text-lg/8 text-pretty text-stone-700">
          This only works with more people. It needs the few who can read hieratic, and the people building the models
          that one day might.
        </p>
        <dl className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-3">
          {audiences.map((a) => (
            <div key={a.who} className="flex flex-col border-t border-black/10 pt-6">
              <dt className="text-2xl font-medium">{a.who}</dt>
              <dd className="mt-3 max-w-[48ch] text-lg/8 text-pretty text-stone-700">{a.ask}</dd>
              <dd className="mt-auto pt-6">
                <a href={a.href} className="flex items-center gap-2 text-lg text-ink underline decoration-black/20 hover:text-rubric hover:decoration-rubric">
                  {a.cta} <Arrow />
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
