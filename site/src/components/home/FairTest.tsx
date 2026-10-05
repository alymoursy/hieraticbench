import { Container } from "@/components/Container";

const reasons = [
  {
    title: "The answer is sealed.",
    body: "The professor's translation has never been published. No model can have memorised it, and the benchmark never prints it.",
  },
  {
    title: "Almost nobody can read it.",
    body: "Hieratic is read fluently by a small circle of specialists, so there is very little labelled data to learn from. Reading it means learning, not recall.",
  },
  {
    title: "Every scribe wrote differently.",
    body: "Signs fuse into ligatures and drift across centuries and hands. A model has to generalise from a sign list to a living hand.",
  },
  {
    title: "Progress shows up early.",
    body: "Four rungs separate seeing the script, reading its signs, sounding it out and understanding it. Partial credit is real credit.",
  },
];

export function FairTest() {
  return (
    <section className="border-t border-black/5 py-24 sm:py-32">
      <Container>
        <h2 className="max-w-[24ch] text-4xl font-medium tracking-tight text-balance sm:text-5xl">
          Why this is a fair test.
        </h2>
        <dl className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2">
          {reasons.map((r) => (
            <div key={r.title} className="border-t border-black/10 pt-6">
              <dt className="text-xl font-medium">{r.title}</dt>
              <dd className="mt-3 max-w-[52ch] text-lg/8 text-pretty text-stone-600">{r.body}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
