# Signs rung: source feasibility and build notes

Rung: `signs`. Each item is one image of a single hieratic sign. The gold answer is its Gardiner code (`gardiner`, a list of acceptable codes). Checked 2026-10-05.

## Verdicts

| Source | License (as stated) | Access | Gardiner labels | Verdict |
|---|---|---|---|---|
| AKU-PAL (Mainz Academy) | "CC BY 4.0" on every hieratogram record | Public JSON API, robots.txt allows all | Yes (MdC/JSesh code per grapheme, plus Möller numbers) | **Usable. Used for the build (`aku-`).** |
| Möller, *Hieratische Paläographie*, archive.org (Boston Public Library scans, 1909) | No license field. Public domain by age (published 1909, author died 1921) | archive.org metadata API, PDF / JP2 downloads | Printed hieroglyph per row. No Gardiner codes; a concordance is needed | Usable (public domain). Not used: AKU-PAL already ships single-sign crops of Möller |
| Möller 1965 Zeller reprint, archive.org | Controlled lending (`inlibrary`, `printdisabled`) | Borrow only | Same | Not usable (not an open download) |
| Möller, Heidelberg digi.ub | Not verified | Site serves a bot challenge to scripted clients. `/cgi-bin/` is disallowed in robots.txt | n/a | Not checked. Not needed |
| Hieratische Paläographie DB (Univ. Tsukuba / Univ. Tokyo) | Datasets: "CC BY 4.0". Images: University of Tokyo reuse terms, equivalent to CC BY 4.0 | IIIF manifests, JSON/CSV datasets, SPARQL. robots.txt `Allow: /` | Yes. Möller to Gardiner concordance (from the St Andrews table) | Usable. Used only as a cross-check of labels. Its image regions are whole table rows, not single signs |
| DDD, Diagnostic Deir el-Medina Dataset (Zenodo 20553713) | "CC BY-NC-SA 4.0" | Zenodo download, about 89 GB | Character and group labels | Not usable (NC) |
| Isut (Nederhof, Tabin, Casey; GitHub `nederhof/isut`) | Repository: GPL-3.0 | GitHub backups (zip per text) | Unicode glyph per annotated sign | Not usable as-is (GPL is not on our list). Needs permission |
| PaPYrus (GitHub `jtabin/PaPYrus`) | Repository: GPL-3.0 | GitHub zips (about 27 MB per variant) | Sign values | Not usable as-is (GPL). Needs permission |
| nkhp (`PhilHen/nkhp`), hieratic-sign-search (`christiancasey/hieratic-sign-search`) | No license | GitHub | Partly | Not usable (no license) |
| HuggingFace | No hieratic datasets found. Hieroglyph datasets are NC or unlicensed | n/a | n/a | Not usable |

### AKU-PAL: details

- URL: https://aku-pal.uni-mainz.de (software version 1.5.0, data last updated 27 Aug 2026). In June 2026 it held 1004 graphemes and 42,805 hieratograms. The API now returns 1055 graphemes and about 48,000 hieratogram references.
- License, per record. Every hieratogram's "Lizenzhinweis" block gives the facsimile creator and `Lizenz: <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>`. Every record we used was checked for this string.
- FAQ, verbatim: "Einzelne Bilder aus der Datenbank dürfen unter der jeweils angegebenen Lizenz genutzt und verbreitet werden (z. B. https://aku-pal.uni-mainz.de/signs/21623)." In English: individual images may be used and redistributed under the license stated for each one. The FAQ also says: "Screenshots von Ansichten, die Bilder verschiedener Herkunft zeigen (z. B. chronologische Listen) können für Forschungs- und Lehrzwecke heruntergeladen werden und dürfen als Bildzitate im Sinne des Urheberrechts weiter genutzt werden, sofern die URL als Quelle angegeben wird." That covers composite screenshots of mixed origin, which we do not use. Citation format: "AKU Hieratogramm 9656, https://aku-pal.uni-mainz.de/signs/9656 (Datum des Zugriffs)".
- robots.txt: `User-agent: *` / `Disallow:` (nothing disallowed). The Impressum has no terms of use beyond the standard disclaimer.
- Access is the public JSON API used by the site's own frontend:
  - `GET /api/graphemes`: all graphemes, about 21 MB, with nested hieratogram lists.
  - `GET /api/graphemes/{id}`
  - `GET /api/signs/{id}`: one hieratogram with images, details and license.
  - `GET /api/facets/graphemes`
  - Images live under `/img/data/ht/svg/ht_{id}.svg` (vector facsimiles), `/img/data/ht/scan/…webp` (retro-digitised crops from Möller and other publications) and `/img/data/ht/photo/…webp` (photographs).
  - There is no bulk download. A IIIF viewer exists for object digitisations only.
- Labels. Each grapheme has an MdC field (mostly JSesh codes, i.e. Gardiner-based), sometimes with `std` and `var` values when one hieratic grapheme covers several hieroglyphs. It also has Möller numbers and a concordance to more than 50 published palaeographies (`graphemeNumbers`), many of which number signs by Gardiner. Each hieratogram has a dating, text, find place, script type (Hieratisch vs Kursivhieroglyphen), preservation and facsimile type.
- Contact for questions or permission: aku@uni-mainz.de.

### Möller on archive.org

- `hieratischepalao01moll`, `hieratischepalao02moll`, `hieratischepalao03moll`: Leipzig, Hinrichs 1909 (vols 1-3), Boston Public Library scans, 360 ppi, JP2 zip about 95-106 MB per volume. No `rights` or `licenseurl` metadata. The work is public domain (Möller died 1921).
- `hieratischepalog01_4mlle`: 1965 Osnabrück reprint of the 2nd edition, in `inlibrary`/`printdisabled`. Lending only.

### Hieratische Paläographie DB (HPDB)

- https://moeller.jinsha.tsukuba.ac.jp/en/datasets/. Verbatim: "All datasets are published under the Creative Commons Attribution 4.0 International license (CC BY 4.0)."
- `id_correspondence.csv` has 937 rows mapping Möller numbers to Gardiner, Unicode, JSesh, TSL, AKU and so on. The Gardiner column is "Cross-referenced from the St Andrews concordance table" (M.-J. Nederhof, *Sign list: hieratic*, https://sites.cs.st-andrews.ac.uk/people/mn31/egyptian/unicode/tablehieratic.html, last updated 2021-07-02, no license stated).
- `curation.json` has 2065 IIIF regions on the University of Tokyo scans of Möller (1909). 97% of them are wide strips (median width/height about 8): whole table rows holding the printed hieroglyph, the number and all the hieratic forms. A single-sign item would need our own cell segmentation, plus removal of the hieroglyph and number columns.
- Image terms: the IIIF manifest `license` is https://www.lib.u-tokyo.ac.jp/ja/library/contents/archives-top/reuse. Those terms are equivalent to CC BY 4.0, allow commercial use with no application, require crediting the holding library (東京大学アジア研究図書館所蔵) and require marking modifications.
- This is the best path if we ever want `mol-` items from the 1909 first edition.

## What was built

All items come from AKU-PAL and use the prefix `aku-`.

Gold label rule: `gardiner` holds the grapheme's MdC code(s) exactly as AKU-PAL gives them. We never read the sign ourselves. Only plain Gardiner-form codes are kept (`A1`, `Aa1`; no JSesh extensions such as `A7A`, no groups, no numerals), with the number inside Gardiner's 1957 range for its category. When AKU lists several plain codes for one grapheme (`std` plus `var`, e.g. `U7`/`U6`, `Y1`/`Y2`), all of them are accepted, because the source says so. The full AKU MdC list is copied into `notes`.

A grapheme was used only if its code was confirmed independently, by either of these checks:
1. At least 2 of the published palaeographies in AKU's own concordance (`graphemeNumbers`, Möller excluded) give the same Gardiner code.
2. The HPDB / St Andrews Möller-to-Gardiner concordance maps one of the grapheme's Möller numbers to that code.

Graphemes where more palaeographies disagree than agree were dropped.

A hieratogram was used only if all of these hold:
- script type is `Hieratisch` (cursive hieroglyphs excluded);
- preservation is `vollständig` (complete);
- the license string is CC BY 4.0;
- the record belongs to the selected grapheme.

Selection:
- 10 common signs × 3 occurrences from different periods: G17, D21, N35, X1, M17, G43, I9, A1, D46, Z1.
- One occurrence each for a long tail of graphemes. These were picked round-robin across the Gardiner categories, most-attested first, with at least 12 attestations.
- Periods were balanced greedily across these buckets: Old Kingdom, First Intermediate Period, Middle Kingdom, Second Intermediate Period, Dynasty 18, Ramesside, Third Intermediate Period, Late Period, Graeco-Roman.
- No more than 5 items come from any one text, and no more than 6 are photographs. A seeded random draw picked among the hieratograms that qualified.
- One drawn hieratogram, HT 13985 (D4), was excluded by hand after visual review. Its facsimile has detached dots beside the sign, so it is unclear whether the crop shows exactly one sign.

Images:
- SVG facsimiles were rendered to PNG at 20 px per mm of the original sign, with the long edge clamped to 160-600 px. Rendering used an isolated Playwright headless Chromium, black ink on white with a white margin.
- Möller scan crops and photographs were converted from WebP to PNG at native size, flattened onto white, with a white margin.
- The hieroglyph image AKU shows next to each sign was never downloaded. No codes or numbers appear in any image.

Fields:
- `source.url` is the hieratogram page.
- `source.fileUrl` is the exact file we downloaded.
- `source.attribution` names the facsimile creator, AKU-PAL and the AKU Hieratogramm number.
- `notes` holds the AKU grapheme ID, MdC values, Möller numbers, bibliographic reference (for retro-digitisations), line, find place, dating and the image processing step (as CC BY requires).
- `object.date` is an English rendering of AKU's German dating. The original German string is kept in `notes`.
- `object.material` comes from AKU's text record (`/api/texts/{id}`: support material and object type).
- `object.content` is AKU's text-type field, verbatim (German).
- `famous` is `true` only for the Möller retro-digitisations, since Möller's plates are widely reproduced.

### Stats (build of 2026-10-05)

**Items:** 150 (`aku-0001` to `aku-0150`), all `split: public`, `rungs: ["signs"]`.

**Labels**

| Measure | Count |
|---|---|
| Distinct AKU graphemes (sign classes) | 130 |
| Distinct Gardiner codes accepted across all gold lists | 144 |
| Items whose gold lists more than one code | 13 |

The 10 common signs have 3 items each. The other 120 graphemes have 1 item each.

**Gardiner categories:** all 26 are covered (A 9, Aa 6, B 2, C 2, D 12, E 5, F 5, G 11, H 4, I 8, K 3, L 2, M 8, N 8, O 5, P 5, Q 5, R 5, S 5, T 5, U 5, V 5, W 5, X 8, Y 4, Z 8).

**Periods**

| Period | Items |
|---|---|
| Old Kingdom | 17 |
| First Intermediate Period | 17 |
| Middle Kingdom | 16 |
| Second Intermediate Period | 16 |
| New Kingdom | 33 (16 Dynasty 18, 17 Ramesside) |
| Third Intermediate Period | 17 |
| Late Period | 17 |
| Argead | 7 |
| Ptolemaic | 1 |
| Roman | 9 |

**Image types**

| Type | Items |
|---|---|
| Vector facsimiles drawn from the manuscripts | 77 |
| Retro-digitised scans | 68 |
| Photographs (all from P. Berlin 3057) | 5 |

Of the 68 scans, 54 are Möller's copies (`famous: true`). The other 14 are retro-digitised facsimiles by U. Verhoeven (13) and J. H. Breasted (1).

**Texts and supports:** 82 distinct texts or manuscripts.

| Support | Items |
|---|---|
| Papyrus | 107 |
| Limestone ostraca | 14 |
| Limestone dipinti | 12 |
| Plaster dipinti | 10 |
| Wooden writing boards | 4 |
| Wooden plaque | 1 |
| Limestone stela | 1 |
| Pottery ostracon | 1 |

**Size:** about 4.2 MB of PNG and 0.24 MB of JSON.

## Caveats

- MdC is not the same as Gardiner. AKU's MdC field is mostly JSesh codes. We kept only codes that look like Gardiner codes and fall inside Gardiner's ranges, and cross-checked them as described above. Gardiner's per-category maxima were taken from Gardiner 1957 as summarised on Wikipedia; edge cases may need a manual look.
- Some hieratic signs cannot be told apart in isolation, for example Z1 (stroke) and other vertical strokes, or N35 and other horizontal lines. Gold follows the source's reading of the sign in context, so expect some unavoidable confusion on such items.
- Several items share a text or manuscript (same `object.name`). Each item is a different sign.
- AKU-PAL marks many records "erste Überprüfung" (first check). The labels are the source's current state.
- Möller retro-digitisations show Möller's hand-drawn copies, not the manuscripts. AKU licenses its crops as CC BY 4.0, and the underlying 1909-1936 plates are public domain.
- Möller's copies make up 54 of 150 items. They dominate some periods: First Intermediate 11/17, Third Intermediate 14/17, Graeco-Roman 12/17. The Late Period items are mostly Verhoeven retro-digitisations (10/17). AKU's own vector facsimiles are sparser for those periods. Use `famous` or `source.fileUrl` (`/scan/`) to analyse them separately.
- The 5 photographs (P. Berlin 3057, courtesy Burkhard Backes) are small and blurry at native size, and they keep AKU's polygon mask (white notches).
- CC BY 4.0 requires attribution and an indication of changes. Both are recorded in each item (`source.attribution` and `notes`).
