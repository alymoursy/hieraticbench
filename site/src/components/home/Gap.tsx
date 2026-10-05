import { Container } from "@/components/Container";
import { best, identifyScore, leaderboard, percent, sentenceScore } from "@/lib/data";

/** The finding in one paragraph, computed from the leaderboard so it never goes stale. */
export function Gap() {
  const papyri = best((k) => identifyScore(k, "hieratic"));
  const sentence = best(sentenceScore);
  const signs = best((k) => leaderboard.entries.find((e) => e.key === k)?.rungs.signs?.score);
  if (papyri === null || sentence === null) return null;
  const sentenceTries = leaderboard.sentenceGuesses.reduce((n, g) => n + g.tries, 0);
  return (
    <section className="border-t border-black/5 py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[3fr_2fr]">
        <h2 className="max-w-[20ch] text-4xl font-medium tracking-tight text-balance sm:text-5xl">
          They know what a papyrus looks like. They can&apos;t read the writing.
        </h2>
        <div className="flex flex-col gap-5 text-lg/8 text-pretty text-stone-700 lg:pt-2">
          <p className="max-w-[52ch]">
            Show the best model a real hieratic document, a papyrus, a pottery shard or a plate from an Egyptology
            book, and it names the script <span className="text-ink tabular-nums">{percent(papyri)}</span> of the time.
            Show it one sentence in the same script, written fresh by an expert, and it scores{" "}
            <span className="text-rubric tabular-nums">{percent(sentence)}</span> across {sentenceTries} tries.
          </p>
          {signs !== null && (
            <p className="max-w-[52ch]">
              Ask it which hieroglyph a single hieratic sign stands for and the best model is right{" "}
              <span className="text-ink tabular-nums">{percent(signs)}</span> of the time. Models seem to know what a
              page of hieratic looks like. They don&apos;t know the signs it is made of.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
