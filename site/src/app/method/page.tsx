import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { leaderboard } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Method",
  description: "How HieraticBench asks, scores and keeps its answer key sealed.",
};

export default function MethodPage() {
  const { prompts, dataset } = leaderboard;
  return (
    <Container className="pt-16 pb-24 sm:pt-24">
      <h1 className="max-w-[20ch] text-5xl font-medium tracking-tight text-balance sm:text-6xl">Method</h1>
      <p className="mt-6 max-w-[56ch] text-xl/8 text-pretty text-stone-600">
        Everything you need to reproduce a score, or to argue with one. The harness, prompts and scoring code are all
        in the <a href={site.github} className="text-ink underline decoration-stone-300 hover:decoration-rubric">repository</a>.
      </p>

      <article className="prose-page mt-8">
        <h2>The items</h2>
        <p>
          Version {leaderboard.harness} has {dataset.items} items. There are three kinds.
        </p>
        <ul>
          <li>
            <strong>Sealed sentences.</strong> One sentence in two images. The first is in the professor&apos;s own hand.
            The second is the same text rewritten in a period-style hand by a hieratic specialist, closer to what a
            scribe would have produced. Both were commissioned in 2022. The script is public. What the sentence says
            is known only to the people who wrote it.
          </li>
          <li>
            <strong>The public identification set.</strong> Photographs and facsimiles of real Egyptian documents from
            Wikimedia Commons, The Metropolitan Museum of Art, Chester Beatty in Dublin and the Yale Peabody Museum. Most are hieratic. The rest are controls in demotic
            and hieroglyphs, so a model that answers hieratic for anything Egyptian loses points.
          </li>
          <li>
            <strong>Single signs.</strong> Hieratic signs from <a href="https://aku-pal.uni-mainz.de">AKU-PAL</a>, the
            Mainz Academy&apos;s palaeography database, each labelled with its Gardiner code by the database itself. A
            label is kept only when published palaeographies agree on it. Signs span the Old Kingdom to the Roman
            period.
          </li>
        </ul>
        <p>
          Every public image is public domain, CC0, CC BY or CC BY-SA, and its record keeps the source page, license
          and attribution. Captions and labels that name the script are cropped out. Items from widely reproduced
          documents are flagged as famous, because a model may have seen that exact photograph in training.
        </p>

        <h2>The prompts</h2>
        <p>
          One image and one user message. No system prompt, no tools, no examples. Identify is asked cold. Every other
          rung tells the model the script, so failing rung one doesn&apos;t sink the rest. Each prompt asks for a final
          answer line, which is the only part that gets scored.
        </p>
        <h3>Identify</h3>
        <pre>{prompts.identify}</pre>
        <h3>Signs, for a sentence</h3>
        <pre>{prompts.signsSequence}</pre>
        <h3>Signs, for a single sign</h3>
        <pre>{prompts.signsSingle}</pre>
        <h3>Transliterate</h3>
        <pre>{prompts.transliterate}</pre>
        <h3>Translate</h3>
        <pre>{prompts.translate}</pre>

        <h2>Scoring</h2>
        <ul>
          <li>
            <strong>Identify.</strong> 1 for the right script, 0.5 for a different Egyptian script, 0 for anything else,
            including UNKNOWN or a missing answer line. Abnormal hieratic counts as hieratic and cursive hieroglyphs
            count as hieroglyphic.
          </li>
          <li>
            <strong>Signs.</strong> A single sign scores 1 when the first code given matches the source&apos;s label. A
            sentence scores one minus the sign error rate, the edit distance between the predicted and reference code
            sequences divided by the reference length, floored at zero.
          </li>
          <li>
            <strong>Transliterate and translate.</strong> On the sentence these are not scored by machine, because no
            answer key is stored. A reading that looks real goes to the people who wrote the sentence. The harness
            still ships character error rate and chrF scoring for future public items with published readings.
          </li>
          <li>
            <strong>Averages.</strong> Samples are averaged per item, then items are averaged per rung.
          </li>
        </ul>
        <p>
          A refusal scores zero. A failed API call is left out and re-run. Server-side model fallbacks are switched off,
          so an answer is always credited to the model that wrote it.
        </p>

        <h2>Keeping the answer sealed</h2>
        <ol>
          <li>
            There is no answer key. Not in the repository, not on a server, not with the maintainer. Only the professor
            and the specialist who wrote the sentence know what it says, and it will never be published.
          </li>
          <li>
            When anyone runs a sealed rung, the answers are written to a local inbox that is never committed either. A
            correct reading would give the answer away, so these stay private.
          </li>
          <li>
            The identify question on the sealed sentences also asks for a translation, so a model that can read it would
            write the answer there. For those items only the script the model named and its score are published. The
            full text stays private.
          </li>
          <li>
            If a model&apos;s reading looks real, it goes privately to the sentence&apos;s authors. They are the only
            ones who can say a model has read it.
          </li>
        </ol>

        <h2>Settings</h2>
        <p>
          Models that take a reasoning effort run at high. Nothing else is tuned, no temperature is set, and the
          provider&apos;s defaults apply. Leaderboard runs ask each sealed item three times per rung, because there are only
          two of them, and each public item once, because there are many. The same model at two effort levels is two
          rows.
        </p>

        <h2>Run it yourself</h2>
        <pre>{`git clone ${site.github}
cd hieraticbench && npm install
cp .env.example .env        # add one provider key
npm run bench -- run --models claude-opus-5-5 --samples 3
npm run bench -- leaderboard`}</pre>
        <p>
          Any model can run as <code>provider:model-id</code>, for example{" "}
          <code>openrouter:qwen/qwen3.8-flash</code>. Claude runs through Anthropic&apos;s API, other labs&apos; models
          through OpenRouter. Scored results land in <code>results/runs</code>.
          Answers about the sentence land in <code>results/inbox</code>. If you think your model has read it, send
          that file to <a href={`mailto:${site.email}`}>{site.email}</a> and the sentence&apos;s authors will check.
        </p>

        <h2>Limits of version {leaderboard.harness}</h2>
        <ul>
          <li>The sealed set is one sentence in two hands. That is a story, not yet a statistic. More sentences from more hands is the first priority.</li>
          <li>The two sealed images are crops of screenshots. They will be replaced with the original scans.</li>
          <li>Famous public documents may be in training data. The famous flag lets you score with or without them.</li>
          <li>To keep costs down, models from other labs answered only the identify question. GPT-6 Astra and both Gemini models were asked about the sentence alone, and Qwen3.8 Max stopped partway through the documents. The leaderboard marks every gap.</li>
          <li>Chat-app transcripts on the home page are context. They use each app&apos;s own system prompt and are never counted on the leaderboard.</li>
        </ul>

        <h2>What comes next</h2>
        <ul>
          <li>New sealed sentences from Egyptologists, in different hands and periods.</li>
          <li>A tool-assisted track where the model can crop and zoom, since the newest models read images better with a crop tool.</li>
          <li>Line-by-line transcriptions of public papyri, annotated sign by sign by specialists.</li>
        </ul>
      </article>
    </Container>
  );
}
