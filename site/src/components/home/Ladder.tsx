import { Container } from "@/components/Container";
import { RUNG_LABEL, best, identifyScore, leaderboard, percent, sentenceScore, type Rung } from "@/lib/data";

const rungs: { rung: Rung; question: string; scoring: string }[] = [
  {
    rung: "identify",
    question: "What writing system is this?",
    scoring:
      "Asked cold, the way you would ask a friend. Demotic and hieroglyphic controls sit in the set, so answering hieratic every time doesn't pay.",
  },
  {
    rung: "signs",
    question: "Which hieroglyph is each sign?",
    scoring: "Answered in Gardiner sign-list codes, the standard Egyptologists use. Scored by sign error rate.",
  },
  {
    rung: "transliterate",
    question: "How does it sound?",
    scoring: "Standard Egyptological transliteration, scored by character error rate on the consonants.",
  },
  {
    rung: "translate",
    question: "What does it say?",
    scoring: "English, scored against the sealed reference with chrF. Anything that gets close goes to an Egyptologist.",
  },
];

function bestSoFar(rung: Rung): string {
  if (rung === "identify") {
    const papyri = best((k) => identifyScore(k, "hieratic"));
    const sentence = best(sentenceScore);
    if (papyri !== null && sentence !== null) return `Best so far ${percent(papyri)} on real documents, ${percent(sentence)} on the sentence`;
  }
  const top = best((k) => leaderboard.entries.find((e) => e.key === k)?.rungs[rung]?.score);
  if (top !== null) return `Best so far ${percent(top)}`;
  return rung === "identify" || rung === "signs" ? "No runs yet" : "Sealed. Scored privately";
}

export function Ladder() {
  return (
    <section id="ladder" className="border-t border-black/5 py-24 sm:py-32">
      <Container>
        <h2 className="max-w-[24ch] text-4xl font-medium tracking-tight text-balance sm:text-5xl">
          Four rungs, from seeing to reading.
        </h2>
        <p className="mt-6 max-w-[56ch] text-lg/8 text-pretty text-stone-600">
          Every rung after the first tells the model it is looking at hieratic, so a model that can&apos;t name the
          script still gets a fair shot at reading it.
        </p>
        <ol role="list" className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {rungs.map((r, i) => (
            <li key={r.rung} className="flex flex-col border-t border-black/10 pt-6">
              <p className="font-mono text-sm tracking-wide text-rubric tabular-nums">{i + 1}</p>
              <h3 className="mt-3 text-2xl font-medium">{RUNG_LABEL[r.rung]}</h3>
              <p className="mt-2 text-lg/7 text-pretty italic">{r.question}</p>
              <p className="mt-4 text-base/7 text-pretty text-stone-600">{r.scoring}</p>
              <p className="mt-auto pt-6 text-base text-ink tabular-nums">{bestSoFar(r.rung)}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
