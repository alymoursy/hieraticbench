# HieraticBench

**Can AI read ancient Egyptian handwriting?**

![The professor's sentence](site/public/hero-sentence.png)

In 2022 I asked an Oxford Egyptology professor to write me one sentence in hieratic, the cursive script ancient Egyptians used for letters, accounts, medicine, maths and stories for more than three thousand years. Hieroglyphs were for monuments. Hieratic was for everything else.

Every AI model I have shown it to fails. Most can't even name the script. Claude Opus 5.5 checked it against Tangut, Khitan, Jurchen, Nüshu and Gregg shorthand, and never once against Egypt. Claude Fable 5.1 decided it wasn't a real writing system. Claude Haiku 4.5 called it Urdu and translated it as "One should learn every day."

HieraticBench turns that sentence into a benchmark, and asks for help making it bigger.

## Results so far

Run on 5 October 2026 through each provider's API. Sealed rungs (transliterate and translate) are waiting to be scored against the private key.

| Model | Names the script of the sentence | Names the script of real documents | Reads single signs |
|---|---|---|---|
| Claude Fable 5.1 | 0% | 95% | 8.7% |
| Claude Opus 5.5 | 0% | 95% | 13% |
| Claude Sonnet 5.5 | 0% | 94% | 11% |
| Claude Haiku 4.5 | 0% | 43% | 0.7% |

Fable, Opus and Sonnet recognise hieratic on real papyri and printed facsimiles almost every time. On the professor's sentence, not one of the four named it, across 24 tries between them. The full table is on the website, and the raw answers are in `results/runs/`. Help us add other labs' models.

## The ladder

Each item is asked at up to four depths. Identify is asked cold. Every later rung tells the model it is looking at hieratic.

| Rung | Question | Scored by |
|---|---|---|
| 1. Identify | What writing system is this? | Script label. 1 right, 0.5 for another Egyptian script, 0 otherwise |
| 2. Signs | Which hieroglyph is each sign? | Gardiner codes. Exact match, or 1 minus sign error rate for a sentence |
| 3. Transliterate | How does it sound? | 1 minus character error rate on a normalised consonant skeleton |
| 4. Translate | What does it say? | chrF against the sealed reference, plus expert review near the top |

The sentence's signs, transliteration and translation are **sealed**. They have never been published and never enter this repository, so no model can have memorised them. See [site/src/app/method/page.tsx](site/src/app/method/page.tsx) or the Method page on the site for the full protocol.

## The dataset

- `data/items/*.json` holds one record per item, with source, license and attribution. Schema in [data/SCHEMA.md](data/SCHEMA.md).
- `data/images/` holds the images, resized for evaluation.
- Two sealed items: the professor's sentence (`hb-0001`) and the same sentence in a period-style hand by a hieratic specialist (`hb-0002`).
- A public identification set of openly licensed hieratic documents, with controls in demotic and hieroglyphs. Collection notes live in `data/sources/`.

## Run it

Requires Node 22 or newer.

```bash
npm install
cp .env.example .env            # add a key for any provider you want to run
npm test                        # scoring unit tests
npm run bench -- run --models claude-opus-5-5 --samples 3
npm run bench -- leaderboard    # rebuilds results/leaderboard.json
npm run dev                     # the website, at http://localhost:3000
```

Model shortcuts are listed by `npm run bench -- models`. Anything else runs as `provider:model-id`, with provider one of `anthropic`, `openai`, `google` or `openrouter`. Examples are `openai:gpt-5` and `openrouter:qwen/qwen3-vl-235b-a22b-instruct`.

Useful flags are `--rungs identify`, `--items hb-,wm-`, `--limit 5` for a smoke test, `--effort max`, and `--dry-run` to print the plan and the first prompt.

### Where results go

- Openly scored answers (the identify rung, and public sign items) go to `results/runs/<run>.jsonl`. Commit these.
- On the sealed sentences, even the identify answer can contain a translation attempt, so the public file keeps only the script named and the score. The full text goes to the inbox with everything else.
- Answers for sealed rungs go to `results/inbox/<run>.jsonl`, which is gitignored. A correct answer would reveal the key, so **don't open a public PR with these**. Email the file to the maintainer instead, who scores it privately with `npm run bench -- score`. Any sealed answer scoring 50% or more has its text withheld before it is published. Its score is always published.

## Deploy the site

The site is a static export. On Vercel, import the repository and set the Root Directory to `site`. The build runs `npm run sync` first, which copies `results/leaderboard.json` and the item images into the app, so rebuild the leaderboard before deploying. Any static host works too, since `npm run build` writes plain files to `site/out/`.

Site links (GitHub, contact email, domain) live in one file, `site/src/lib/site.ts`.

## Contribute

- **Egyptologists.** Write a new sealed sentence, or annotate signs in a published papyrus. Open an issue with the "Offer a sentence" template, or email.
- **AI researchers.** Run the harness on your model and send the results. Or build a dedicated reader. Public sign lists and corpora are a fair starting point.
- **Everyone.** Share it, introduce us to an Egyptologist, or sponsor a commissioned sentence.

## Repository layout

```
bench/     evaluation harness (TypeScript, official provider SDKs)
data/      items, images, schema, source notes
results/   run logs, the leaderboard, chat-app spot checks
site/      the website (Next.js, static export)
```

## License

Code is MIT. Public images keep the license recorded in their item file. The two commissioned sentence images are not openly licensed. They may be used to evaluate models with this benchmark, and for nothing else without permission.
