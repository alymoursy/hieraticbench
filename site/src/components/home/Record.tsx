import { Container } from "@/components/Container";
import { formatDate, leaderboard, times } from "@/lib/data";

export function Record() {
  const quoted = leaderboard.spotchecks.filter((s) => s.quote);
  const unquoted = leaderboard.spotchecks.filter((s) => !s.quote);
  return (
    <section id="record" className="border-t border-black/5 py-24 sm:py-32">
      <Container>
        <h2 className="max-w-[24ch] text-4xl font-medium tracking-tight text-balance sm:text-5xl">
          What the models said.
        </h2>
        <p className="mt-6 max-w-[56ch] text-lg/8 text-pretty text-stone-600">
          The same image, the same plain question. Asked in the apps people actually use, and through the API.
        </p>
        <ol role="list" className="mt-16 divide-y divide-black/5 border-y border-black/5">
          {quoted.map((s) => (
            <li key={s.id} className="grid gap-4 py-10 md:grid-cols-[2fr_5fr] md:gap-12">
              <div className="text-base text-stone-600 sm:text-sm/6">
                <p className="text-lg font-medium text-ink">{s.model}</p>
                <p>
                  {formatDate(s.date)}, {s.surface}
                </p>
                <p className="mt-3 text-pretty italic">{s.prompt}</p>
              </div>
              <div>
                <blockquote className="max-w-[44ch] text-2xl/9 text-pretty sm:text-[1.75rem]/10">
                  <p className="relative before:absolute before:-translate-x-full before:content-['\201C'] after:content-['\201D']">{s.quote}</p>
                </blockquote>
                {s.detail && <p className="mt-4 max-w-[60ch] text-lg/7 text-pretty text-stone-600">{s.detail}</p>}
                <p className="mt-4 text-base text-rubric">{s.verdict}</p>
              </div>
            </li>
          ))}
        </ol>
        {leaderboard.sentenceGuesses.length > 0 && (
          <div className="grid gap-4 border-b border-black/5 py-10 md:grid-cols-[2fr_5fr] md:gap-12">
            <div className="text-base text-stone-600 sm:text-sm/6">
              <p className="text-lg font-medium text-ink">Through the API</p>
              <p>Both images, several tries each, the same plain question</p>
            </div>
            <dl className="flex flex-col gap-4">
              {leaderboard.sentenceGuesses.map((g) => (
                <div key={g.model} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                  <dt className="shrink-0 text-lg sm:w-48">{g.model}</dt>
                  <dd className="text-lg/7 text-pretty text-stone-600">
                    {g.answers.map((a, i) => (
                      <span key={a.answer}>
                        {i > 0 && ", "}
                        <span className={a.answer === "Unknown" ? "" : "text-ink italic"}>{a.answer}</span> {times(a.count)}
                      </span>
                    ))}
                    .
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <div className="mt-16 grid gap-6 md:grid-cols-[2fr_5fr] md:gap-12">
          <div />
          <div className="max-w-[44ch]">
            <p className="text-3xl/10 font-medium tracking-tight text-balance">
              Opus 5.5 checked Tangut, Khitan, Jurchen and Nüshu. It checked Gregg shorthand. It never checked Egypt.
            </p>
            {unquoted.map((s) => (
              <p key={s.id} className="mt-6 text-lg/7 text-stone-600">
                {s.model} also failed to name the script. {s.verdict.includes("not archived") ? "We didn't keep the transcript." : ""}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
