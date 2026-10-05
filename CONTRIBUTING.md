# Contributing to HieraticBench

HieraticBench is built to run without anyone's permission. You do the work in your own fork with your own API keys, open a pull request, and automated checks make it safe to merge. Merging updates the leaderboard and the website on its own.

The only thing kept private is the answer key to the sealed sentences.

## Add a model to the leaderboard

You pay for your own API calls. A full public run is a few hundred questions. Use `--limit 5` first to see the cost per question.

```bash
git clone https://github.com/<you>/hieraticbench && cd hieraticbench
npm install
cp .env.example .env            # add the key for your provider
npm run bench -- run --models <model> --rungs identify,signs --max-cost 10
npm run validate
```

- `<model>` is a shortcut from `npm run bench -- models`, or any `provider:model-id`, for example `openrouter:qwen/qwen3.8-flash`. Claude runs through `anthropic`, everything else is easiest through `openrouter`.
- `--max-cost` stops the run at that many dollars (OpenRouter reports cost). `--resume` finishes an interrupted run.
- Commit the new files in `results/runs/` and open a pull request. Say which model, effort and sample count you used.

To add a model as a named shortcut, add one line to `bench/src/models.ts`.

### The sealed sentences

Running every rung also asks the sealed questions (signs, transliteration, translation). Those answers land in `results/inbox/`, which git ignores, because a correct answer would reveal the key.

**Never open a pull request with inbox files.** Email them to aly@veeza.ai. A maintainer scores them against the private key, and only the scores are published. CI rejects any public file that contains answer text for a sealed item.

## Add images to the dataset

Real hieratic documents, controls in demotic or hieroglyphs, and single signs are all welcome.

1. Read [data/SCHEMA.md](data/SCHEMA.md). One JSON file per item in `data/items/`, one image in `data/images/`.
2. Use only public domain, CC0, CC BY or CC BY-SA images, and record the license exactly as the source states it. No non-commercial or no-derivatives licenses.
3. Crop out any caption or label that names the script.
4. Gold labels must come from the source (a museum record, a published palaeography), never from your own reading.
5. Run `npm run validate`, then open a pull request.

## Write a sealed sentence (Egyptologists)

This is the most valuable contribution there is. Every new sentence makes the benchmark harder to game.

Don't post the sentence, its transliteration or its translation anywhere public, including GitHub issues. Open an issue with the "Offer a sentence" template, or email aly@veeza.ai, and we'll arrange a private handover. By offering one you agree it can be used to evaluate models, and that you'll keep the answer private.

## For maintainers

A maintainer reviews and merges. That's the whole job.

- **Merge** when CI is green and the pull request touches only what it says. Vercel redeploys the site on merge, and the build rebuilds the leaderboard from `results/runs/`.
- **Score sealed answers** (whoever holds the key): put emailed files in `results/inbox/`, run `npm run bench -- score`, then commit the new files in `results/runs/`. High-scoring answers are withheld automatically.
- **Never** commit `data/private/`, `results/inbox/` or `.env`. CI blocks all three.
