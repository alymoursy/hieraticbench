# Item schema

Every benchmark item is one JSON file in `data/items/<id>.json` plus one image in `data/images/`.

```jsonc
{
  "id": "wm-0001",                 // unique; prefix = source (hb = commissioned, wm = Wikimedia, met = Met Museum, aku = AKU-PAL, ...)
  "split": "public",               // "public" (answers in this file) or "sealed" (answers held privately)
  "rungs": ["identify"],           // which rungs this item is scored on: identify | signs | transliterate | translate
  "image": "images/wm-0001.jpg",   // path relative to data/
  "title": "Edwin Smith Papyrus, column 6",

  // Gold answers for public rungs. Sealed items leave these out (they live in data/private/answers.json).
  "script": "hieratic",            // identify gold: hieratic | abnormal-hieratic | hieroglyphic | cursive-hieroglyphic | demotic | coptic | other
  "gardiner": ["G17"],             // signs gold for a single-sign item: acceptable Gardiner codes (any match = correct)

  "object": {                      // what the image shows; omit fields you can't source
    "name": "Edwin Smith Papyrus",
    "date": "c. 1600 BCE",
    "period": "Second Intermediate Period",
    "material": "papyrus",
    "holder": "New York Academy of Medicine",
    "content": "Surgical treatise"
  },

  "source": {
    "url": "https://commons.wikimedia.org/wiki/File:...",   // human-readable page for the exact file
    "fileUrl": "https://upload.wikimedia.org/...",          // the original file that was downloaded
    "license": "Public domain",                              // as stated by the source, verbatim
    "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
    "attribution": "New York Academy of Medicine, via Wikimedia Commons",
    "retrieved": "2026-10-05"
  },

  "famous": true,                  // widely reproduced object: a model may have seen this exact image
  "notes": "Cropped to columns 6-7 from the full plate."
}
```

## Image rules

- JPEG, quality 90, long edge at most 2000 px, EXIF stripped. Single-sign crops stay at native size (PNG is fine).
- One item per distinct region. Crops of the same plate are fine if they show different text, but mark them with the same `object.name`.
- No watermarks, museum labels, or captions in the frame that name the script. A caption reading "hieratic" gives the answer away. Crop it out.

## Licenses we accept

Public domain, CC0, CC BY, CC BY-SA. Record the license exactly as the source states it.
No NC/ND, "all rights reserved", or unclear provenance. When in doubt, leave it out.
