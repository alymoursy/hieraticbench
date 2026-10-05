import { Container } from "@/components/Container";

/** The sentence is the exam, not the prize. Hieratic is the goal. */
export function Goal() {
  return (
    <section className="border-t border-black/5 py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[3fr_2fr]">
        <h2 className="max-w-[20ch] text-4xl font-medium tracking-tight text-balance sm:text-5xl">
          The goal isn&apos;t this sentence. It&apos;s hieratic.
        </h2>
        <div className="flex flex-col gap-5 text-lg/8 text-pretty text-stone-700 lg:pt-2">
          <p className="max-w-[52ch]">
            The sentence is the exam. Its answer has never been published, so a model can&apos;t pass by remembering
            something it read online. The only way through is to actually read hieratic.
          </p>
          <p className="max-w-[52ch]">
            What we want is AI that can read the handwriting of ancient Egypt, sign by sign, on any papyrus or pottery
            shard, and help the few people who read it today with the many documents still waiting. A model that can do
            that will read this sentence too. On that day we publish the professor&apos;s answer.
          </p>
        </div>
      </Container>
    </section>
  );
}
