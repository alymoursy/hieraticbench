import { Arrow } from "@/components/Arrow";
import { Container } from "@/components/Container";
import { Readings } from "@/components/Readings";
import { leaderboard, sentenceScore } from "@/lib/data";
import { site } from "@/lib/site";

/** The claim under the headline, kept true by the leaderboard. */
function nameTheScript(): string {
  const named = leaderboard.entries.filter((e) => (sentenceScore(e.key) ?? 0) > 0);
  const tested = leaderboard.entries.length;
  if (named.length === 0) return `We tested ${tested} models. Not one could even name the script.`;
  const who = named.map((e) => e.label.replace(/ \(.*\)$/, ""));
  const list = who.length === 1 ? who[0] : `${who.slice(0, -1).join(", ")} and ${who.at(-1)}`;
  return `We tested ${tested} models. Only ${list} ever named the script, and none could read it.`;
}

export function Hero() {
  const fromChats = leaderboard.spotchecks.flatMap((s) => (s.reading ? [{ model: s.model, reading: s.reading }] : []));
  const fromApi = leaderboard.sentenceGuesses.flatMap((g) =>
    g.answers.filter((a) => a.answer !== "Unknown" && a.answer !== "No answer").map((a) => ({ model: g.model, reading: a.answer })),
  );
  const seen = new Set<string>();
  const readings = [...fromChats, ...fromApi].filter((r) => {
    const key = `${r.model}|${r.reading.split(",")[0].toLowerCase()}`;
    return seen.has(key) ? false : (seen.add(key), true);
  });
  return (
    <section className="pt-8 pb-24 sm:pt-14 sm:pb-32">
      <Container>
        <figure className="-mx-2 sm:mx-0">
          <img
            src="/hero-sentence.png"
            alt="A single line of hieratic handwriting in black ink, about a dozen joined signs, written in 2022 by an Oxford Egyptology professor."
            className="w-full"
            width={1318}
            height={341}
          />
        </figure>
        <div className="mt-6 min-h-16 sm:mt-8">
          <Readings readings={readings} />
        </div>
        <h1 className="mt-14 max-w-[20ch] text-5xl font-medium tracking-tight text-balance sm:mt-20 sm:text-7xl">
          No AI can read this sentence.
        </h1>
        <p className="mt-6 max-w-[48ch] text-xl/8 text-pretty text-stone-600">
          An Oxford Egyptologist wrote it for me in 2022, in hieratic, the everyday handwriting of ancient Egypt.{" "}
          {nameTheScript()}
        </p>
        <p className="mt-6 text-lg text-stone-600 sm:text-base">
          <span className="text-ink">{site.founder}</span>, Founder of{" "}
          <a href={site.company.url} className="text-ink underline decoration-stone-300 hover:decoration-rubric">
            {site.company.name}
          </a>{" "}
          ({site.company.batch})
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href="#join"
            className="rounded-full bg-ink px-5 py-3 text-lg text-white hover:bg-stone-800 focus-visible:outline-offset-2"
          >
            Help crack it
          </a>
          <a href="#leaderboard" className="flex items-center gap-2 text-lg text-ink hover:text-rubric">
            See the leaderboard <Arrow />
          </a>
        </div>
      </Container>
    </section>
  );
}
