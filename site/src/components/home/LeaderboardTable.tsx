import { Arrow } from "@/components/Arrow";
import { Container } from "@/components/Container";
import { documentCoverage, formatDate, identifyScore, leaderboard, percent, sentenceScore, type Entry } from "@/lib/data";



function Cell({ value, pending = "Pending" }: { value: number | null | undefined; pending?: string }) {
  if (value === null || value === undefined) return <span className="text-stone-500">{pending}</span>;
  return <span className={value === 0 ? "text-rubric" : ""}>{percent(value)}</span>;
}

function Coverage({ entryKey }: { entryKey: string }) {
  const { answered, total } = documentCoverage(entryKey);
  if (answered === 0 || answered === total) return null;
  return (
    <span className="ml-2 text-stone-500">
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
          <>
          {/* Phones: one stacked row per model, the three scores that exist today labelled underneath. */}
          <ol role="list" className="mt-12 divide-y divide-black/5 border-y border-black/10 tabular-nums md:hidden">
            {entries.map((e, i) => (
              <li key={e.key} className="flex gap-4 py-4">
                <p className="w-6 shrink-0 text-lg text-stone-500">{i + 1}</p>
                <div className="min-w-0 flex-1">
                  <p className="text-lg text-ink">{e.label}</p>
                  <dl className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-base text-stone-600">
                    <div className="flex gap-1.5">
                      <dt>Sentence</dt>
                      <dd>
                        <Cell value={sentenceScore(e.key)} pending="Not run" />
                      </dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt>Documents</dt>
                      <dd>
                        <Cell value={identifyScore(e.key, "hieratic")} pending="Not run" />
                        <Coverage entryKey={e.key} />
                      </dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt>Signs</dt>
                      <dd>
                        <Cell value={e.rungs.signs?.score} pending="Not run" />
                      </dd>
                    </div>
                  </dl>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-14 -mx-6 -my-2 overflow-x-auto whitespace-nowrap max-md:hidden lg:-mx-8">
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
                    <th scope="col" className="py-3 font-normal whitespace-nowrap">Single signs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {entries.map((e, i) => (
                    <tr key={e.key}>
                      <td className="py-4 pr-4 text-stone-500">{i + 1}</td>
                      <td className="py-4 pr-8 text-ink">{e.label}</td>
                      <td className="py-4 pr-8">
                        <Cell value={sentenceScore(e.key)} pending="Not run" />
                      </td>
                      <td className="py-4 pr-8">
                        <Cell value={identifyScore(e.key, "hieratic")} pending="Not run" />
                        <Coverage entryKey={e.key} />
                      </td>
                      <td className="py-4">
                        <Cell value={e.rungs.signs?.score} pending="Not run" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </>
        )}
        <p className="mt-8 max-w-[68ch] text-base/7 text-pretty text-stone-600 sm:text-sm/6">
          {entries
            .filter((e) => e.refusals > 0)
            .map((e) => `${e.label} declined ${e.refusals} questions, which count as wrong. `)
            .join("")}
          Real documents counts hieratic documents only, not the demotic and hieroglyphic controls. Transliterating and
          translating the sentence aren&apos;t scored here, because no answer key is stored. A reading that looks real goes
          to the people who wrote it. Chat-app transcripts above are quoted for the record and never counted here.
        </p>
      </Container>
    </section>
  );
}
