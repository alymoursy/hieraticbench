import { Arrow } from "@/components/Arrow";
import { Container } from "@/components/Container";
import { RUNGS, RUNG_LABEL, documentCoverage, formatDate, identifyScore, leaderboard, percent, sentenceScore, type Entry } from "@/lib/data";

const READING_RUNGS = RUNGS.filter((r) => r !== "identify");

function Cell({ value, pending = "Pending" }: { value: number | null | undefined; pending?: string }) {
  if (value === null || value === undefined) return <span className="text-stone-400">{pending}</span>;
  return <span className={value === 0 ? "text-rubric" : ""}>{percent(value)}</span>;
}

function Coverage({ entryKey }: { entryKey: string }) {
  const { answered, total } = documentCoverage(entryKey);
  if (answered === 0 || answered === total) return null;
  return (
    <span className="ml-2 text-stone-400">
      {answered} of {total}
    </span>
  );
}

export function LeaderboardTable() {
  // Every model ties at 0% on the sentence, so rank by real documents, then signs.
  const entries: Entry[] = [...leaderboard.entries].sort(
    (a, b) =>
      (identifyScore(b.key, "hieratic") ?? -1) - (identifyScore(a.key, "hieratic") ?? -1) ||
      (b.rungs.signs?.score ?? -1) - (a.rungs.signs?.score ?? -1),
  );
  const updated = formatDate(leaderboard.generatedAt);
  return (
    <section id="leaderboard" className="border-t border-black/5 py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">Leaderboard</h2>
            <p className="mt-6 max-w-[56ch] text-lg/8 text-pretty text-stone-600">
              Every score comes from the open harness, through Anthropic&apos;s API for Claude and OpenRouter for everyone else. The first two columns
              ask a model to name the script, on the professor&apos;s sentence and on real ancient documents. Updated {updated}.
            </p>
          </div>
          <a href="/method/" className="flex shrink-0 items-center gap-2 text-lg text-ink hover:text-rubric">
            How scoring works <Arrow />
          </a>
        </div>

        {entries.length === 0 ? (
          <p className="mt-16 border-y border-black/10 py-10 text-lg text-stone-600">
            The first harness runs are in progress.
          </p>
        ) : (
          <div className="mt-14 -mx-6 -my-2 overflow-x-auto whitespace-nowrap lg:-mx-8">
            <div className="inline-block min-w-full px-6 py-2 align-middle lg:px-8">
              <table className="w-full text-left text-lg tabular-nums sm:text-base">
                <thead>
                  <tr className="border-b border-black/10 text-base text-stone-600 sm:text-sm">
                    <th scope="col" className="w-10 py-3 pr-4 font-normal whitespace-nowrap">
                      <span className="sr-only">Rank</span>
                    </th>
                    <th scope="col" className="py-3 pr-8 font-normal whitespace-nowrap">Model</th>
                    <th scope="col" className="py-3 pr-8 font-normal whitespace-nowrap">The sentence</th>
                    <th scope="col" className="py-3 pr-8 font-normal whitespace-nowrap">Real documents</th>
                    {READING_RUNGS.map((r) => (
                      <th key={r} scope="col" className="py-3 pr-8 font-normal whitespace-nowrap">
                        {RUNG_LABEL[r]}
                      </th>
                    ))}
                    <th scope="col" className="py-3 font-normal whitespace-nowrap">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {entries.map((e, i) => (
                    <tr key={e.key}>
                      <td className="py-4 pr-4 text-stone-400">{i + 1}</td>
                      <td className="py-4 pr-8 text-ink">{e.label}</td>
                      <td className="py-4 pr-8">
                        <Cell value={sentenceScore(e.key)} pending="Not run" />
                      </td>
                      <td className="py-4 pr-8">
                        <Cell value={identifyScore(e.key, "hieratic")} pending="Not run" />
                        <Coverage entryKey={e.key} />
                      </td>
                      {READING_RUNGS.map((r) => (
                        <td key={r} className="py-4 pr-8">
                          <Cell value={e.rungs[r]?.score} pending={leaderboard.sealedAnswered[e.key]?.[r] ? "Sealed" : "Not run"} />
                        </td>
                      ))}
                      <td className="py-4 font-medium">
                        <Cell value={e.overall} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <p className="mt-8 max-w-[68ch] text-base/7 text-pretty text-stone-600 sm:text-sm/6">
          {entries
            .filter((e) => e.refusals > 0)
            .map((e) => `${e.label} declined ${e.refusals} questions, which count as wrong. `)
            .join("")}
          Real documents counts hieratic documents only. The demotic and hieroglyphic controls still count toward the
          overall score. Sealed means the model&apos;s answers are in and waiting to be scored against the private key. The overall
          score appears once all four rungs are scored. Chat-app transcripts above are quoted for the record and never
          counted here.
        </p>
      </Container>
    </section>
  );
}
