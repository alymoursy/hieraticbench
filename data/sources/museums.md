# Museum open-access sources (`met-`, `cbl-`, `ypm-`)

Built 2026-10-05. 55 items, all `split: public`, `rungs: ["identify"]`. 39 hieratic, 10 demotic controls, 5 hieroglyphic and 1 cursive-hieroglyphic controls.
Each script label comes from the holding museum's own record (title, object name, tags or "Script type" field). The notes field of every item says which one.
Every image was looked at after cropping. Crops remove mount labels, shelfmark tags and handwritten notes that name the script. Met accession numbers painted in red on some ostraca were left in place because they do not name the script.

## How the sources were accessed

- **The Met.** Collection API. `/v1/search` was retired on 2026-10-01, so the build used `/v1.1/search` (paginated) plus `/v1/objects/{id}`. Only objects with `isPublicDomain: true` were used. The original JPEG was downloaded from `images.metmuseum.org`. The object pages on metmuseum.org return a bot checkpoint (HTTP 429) to scripted clients, so the long descriptions could not be read. Labels rest on the API fields `title`, `objectName` and `tags`. The API's Imperva front end blocked the client after about 50 fast requests. At 1 request per second it worked.
- **Chester Beatty (CBL), Dublin.** Found via Europeana (data provider "Chester Beatty", `edm:rights` CC BY 4.0 on every record used). Images and metadata come from the CBL Goobi viewer IIIF manifests (`viewer.cbl.ie/viewer/api/v1/records/<id>/manifest/`). Each manifest has a "Script type" field. The Chester Beatty copyright page states that digital images of museum objects are CC BY 4.0 unless otherwise listed. The manifest's own `license` field is a placeholder (`iiif_license`).
- **Yale Peabody Museum (YPM).** Found via Yale LUX (`lux.collections.yale.edu/api/search/item`). The IIIF manifest gives `rights: https://creativecommons.org/publicdomain/zero/1.0/`.

## Items

| id | script | object | museum | license |
|---|---|---|---|---|
| met-0001 | hieratic | Hieratic Jar Label (Met 17.10.2), ca. 1386–1347 BCE | The Met | CC0 (Met Open Access) |
| met-0002 | hieratic | Letter written in hieratic script on papyrus (Met 27.3.560), ca. 1473–1458 BCE | The Met | CC0 (Met Open Access) |
| met-0003 | hieratic | Hieratic ostracon recording the accession of Seti II (Met 14.6.217), ca. 1214–1208 BCE | The Met | CC0 (Met Open Access) |
| met-0004 | hieratic | Ostracon with hieratic inscription (Met 19.3.20), ca. 1300–525 BCE | The Met | CC0 (Met Open Access) |
| met-0005 | hieratic | Ostracon with hieratic inscription (Met 19.3.22), ca. 1300–525 BCE | The Met | CC0 (Met Open Access) |
| met-0006 | hieratic | Ostracon with hieratic inscription (Met 19.3.23), ca. 1300–525 BCE | The Met | CC0 (Met Open Access) |
| met-0007 | hieratic | Ostracon with hieratic inscription (Met 19.3.24), ca. 721–525 BCE | The Met | CC0 (Met Open Access) |
| met-0008 | hieratic | Ostracon with hieratic inscription (Met 19.3.25), ca. 1300–525 BCE | The Met | CC0 (Met Open Access) |
| met-0009 | hieratic | Ostracon with hieratic inscription (Met 19.3.26), ca. 1300–525 BCE | The Met | CC0 (Met Open Access) |
| met-0010 | hieratic | Ostracon with hieratic inscription (Met 19.3.29), ca. 1300–525 BCE | The Met | CC0 (Met Open Access) |
| met-0011 | hieratic | Hieratic Papyrus fragment (Met O.C.3569), ca. 1181 BCE | The Met | CC0 (Met Open Access) |
| met-0012 | hieratic | Letter with hieratic inscription (Met 27.3.561a, b), ca. 1550–1300 BCE | The Met | CC0 (Met Open Access) |
| met-0013 | hieratic | Hieratic copy of the Teaching of Amenemhat I (Met 32.1.119), ca. 1300–1080 BCE | The Met | CC0 (Met Open Access) |
| met-0014 | hieratic | Hieratic ostracon with one column of accounts (Met 26.3.166), 525–404 BCE | The Met | CC0 (Met Open Access) |
| met-0015 | hieratic | Hieratic Ostracon Dated to Year 21 of Ramesses II (Met 09.184.183), ca. 1269 BCE | The Met | CC0 (Met Open Access) |
| met-0016 | hieratic | Ostracon with hieratic inscription (Met 22.3.26), ca. 1300–525 BCE | The Met | CC0 (Met Open Access) |
| met-0017 | hieratic | Hieratic ostracon (Met 09.184.749), ca. 1200–1080 BCE | The Met | CC0 (Met Open Access) |
| met-0018 | hieratic | Ostracon with hieratic inscription (Met 22.3.24), ca. 1300–525 BCE | The Met | CC0 (Met Open Access) |
| met-0019 | hieratic | Folded Piece of Linen with Hieratic Inscription (Met 27.3.118), ca. 1961–1917 B.C. | The Met | CC0 (Met Open Access) |
| met-0020 | hieratic | Hieratic ostracon inscribed with literary text and work journal (Met 14.6.216), ca. 1300–1080 BCE | The Met | CC0 (Met Open Access) |
| met-0021 | hieratic | Heqanakht Account VI (Met 22.3.521), ca. 1961–1917 B.C. | The Met | CC0 (Met Open Access) |
| met-0022 | hieratic | Accounts of workforce salaries (Met 22.3.527), ca. 1961–1917 B.C. | The Met | CC0 (Met Open Access) |
| met-0023 | hieratic | Papyrus inscribed with an account and a religious text (Met 22.3.528), ca. 1961–1917 B.C. | The Met | CC0 (Met Open Access) |
| met-0024 | hieratic | Jar With Hieratic Inscription (Met 16.10.501), ca. 1550–1458 BCE | The Met | CC0 (Met Open Access) |
| met-0025 | hieratic | Ostracon with Pharaoh Spearing a Lion and a Royal Hymn on its Back (Met 26.7.1453), ca. 1200–1080 BCE | The Met | CC0 (Met Open Access) |
| met-0026 | hieratic | Ostracon (Met 68.135.3), 305 BCE–364 CE | The Met | CC0 (Met Open Access) |
| met-0027 | hieratic | Papyrus inscribed with six "Osiris Liturgies" (Met 35.9.21a–o), ca. 332–200 BCE | The Met | CC0 (Met Open Access) |
| met-0028 | hieratic | Book of the Dead of the Priest of Horus, Imhotep (Imuthes) (Met 35.9.20a–w), ca. 332–200 BCE | The Met | CC0 (Met Open Access) |
| met-0029 | hieroglyphic | Sheet from the Papyrus of Amenhotep (Met 30.8.70a), ca. 1427–1386 BCE | The Met | CC0 (Met Open Access) |
| met-0030 | hieroglyphic | Ostracon With a Sketch for a Mereseger Stela (Met 09.184.705), ca. 1300–1200 BCE | The Met | CC0 (Met Open Access) |
| met-0031 | hieroglyphic | Coffin of Ukhhotep, son of Hedjpu (Met 12.182.132a, b), ca. 1981–1802 B.C. | The Met | CC0 (Met Open Access) |
| met-0032 | demotic | Marriage Contract (Met 35.4.1a, b), 380–343 BCE | The Met | CC0 (Met Open Access) |
| met-0033 | demotic | Ostracon (Met 14.1.448), 664 BCE–1st century CE | The Met | CC0 (Met Open Access) |
| met-0034 | demotic | Ostracon (Met 14.1.445), 664 BCE–1st century CE | The Met | CC0 (Met Open Access) |
| met-0035 | hieratic | Ostracon (Met 25.10.25.1), 595–30 BCE | The Met | CC0 (Met Open Access) |
| met-0036 | hieratic | Ostracon with hieratic inscription (Met 19.3.21), ca. 1300–525 BCE | The Met | CC0 (Met Open Access) |
| met-0037 | demotic | Ostracon (Met 14.1.446), 664 BCE–1st century CE | The Met | CC0 (Met Open Access) |
| cbl-0001 | hieratic | Chester Beatty Pap 1.5 (Papyrus Chester Beatty I), c. 1160 BC | Chester Beatty | CC BY 4.0 |
| cbl-0002 | hieratic | Chester Beatty Pap 1.2 (Papyrus Chester Beatty I), c. 1160 BC | Chester Beatty | CC BY 4.0 |
| cbl-0003 | hieratic | Chester Beatty Pap 1.4 (Papyrus Chester Beatty I), c. 1160 BC | Chester Beatty | CC BY 4.0 |
| cbl-0004 | hieratic | Chester Beatty Pap XXII, c. 1800 BC (Lahun fragments), 100 BC-100 AD (Book of the Dead fragments) | Chester Beatty | CC BY 4.0 |
| cbl-0005 | hieratic | Chester Beatty Pap XX, 10th or 9th century BC | Chester Beatty | CC BY 4.0 |
| cbl-0006 | hieratic | Chester Beatty Pap XXa, c. 100 AD | Chester Beatty | CC BY 4.0 |
| cbl-0007 | hieratic | Chester Beatty Pap XXIII, 3rd century BC | Chester Beatty | CC BY 4.0 |
| cbl-0008 | hieratic | Chester Beatty Pap XXIV, 4th century BC | Chester Beatty | CC BY 4.0 |
| cbl-0009 | hieroglyphic | Chester Beatty Pap XXII, c. 1800 BC (Lahun fragments), 100 BC-100 AD (Book of the Dead fragments) | Chester Beatty | CC BY 4.0 |
| cbl-0010 | hieroglyphic | Chester Beatty Pap XXI.2, c. 300 BC | Chester Beatty | CC BY 4.0 |
| cbl-0011 | demotic | Chester Beatty MP Dem 2, Unknown | Chester Beatty | CC BY 4.0 |
| cbl-0012 | demotic | Chester Beatty Pap XXIX, unknown | Chester Beatty | CC BY 4.0 |
| cbl-0013 | demotic | Chester Beatty Pap XXVI.2, 168-116 BC | Chester Beatty | CC BY 4.0 |
| cbl-0014 | demotic | Chester Beatty Pap XXX, 4th century BC | Chester Beatty | CC BY 4.0 |
| cbl-0015 | demotic | Chester Beatty Pap XXV, 2nd or 1st century BC | Chester Beatty | CC BY 4.0 |
| cbl-0016 | demotic | Chester Beatty Pap XXVII, 96-95 BC | Chester Beatty | CC BY 4.0 |
| ypm-0001 | hieratic | Fragment of a hieratic papyrus (Yale Peabody Museum YPM ANT 006207), Greco-Roman Period | Yale Peabody | CC0 1.0 (Yale Peabody Museum Open Access) |
| ypm-0002 | cursive-hieroglyphic | Small stela of Hornakht (Yale Peabody Museum YPM ANT 261382), ca. 1900-1700 BCE | Yale Peabody | CC0 1.0 (Yale Peabody Museum Open Access) |

## Notable rejections and caveats

- **Cleveland Museum of Art.** The open-access API works and its Egyptian papyri are CC0: Book of the Dead of Hori 1921.1032, of Bakenmut 1914.882 and of Buiruharmut 1914.733; Amduat papyri 1914.725 and 1914.732; Oracular Amuletic Decree 1914.723. None of these records names the script. A search for "hieratic" returns no Egyptian objects. Not used, because the label could not be tied to the museum record.
- **Art Institute of Chicago.** The keyword search does not match "hieratic" or "demotic" anywhere. The only Egyptian papyrus found (Funerary Papyrus of Tayuhenutmut, 1894.180, CC0) has no script field. Not used.
- **Walters, Brooklyn, Rijksmuseum van Oudheden.** Their sites serve Cloudflare or Vercel bot challenges to scripted clients. RMO has many CC BY 4.0 hieratic and demotic records on Europeana (e.g. AMS 27, "handschrift ; hiëratisch"), but its image proxy `img.rmo.nl` returned HTTP 502, and Europeana holds only 400-500 px previews. Not used. RMO is worth retrying later: it has the largest pool of labelled hieratic.
- **Smithsonian.** The records found (NMNH "Fgt of Book of the Dead in Hieratic" etc.) have no online media. The demo key only allows a few calls. Not used.
- **Wellcome Collection.** "Egyptian Papyrus, Hieratic funerary liturgy" (L0015023, L0015013, CC BY 4.0). These are low-resolution black-and-white photos of a framed roll and the signs are not legible. Rejected.
- **Yale Beinecke papyri (YPC).** Several fragments are described as hieratic, but the IIIF manifests carry no rights statement. Not used.
- **Yale University Art Gallery.** Some ostraca are labelled "cursive inscription: Demotic Egyptian" (e.g. 1978.45.28, CC0). The only image is 480 px. Not used.
- **British Museum.** Skipped (CC BY-NC-SA), as instructed.
- **Met, dropped after review.** 09.184.786 "Hieroglyph ostracon": its objectName says "identity marks", which are a special sign system, not a clean hieroglyphic control. Jar 23.5 and the Hatshepsut valley-temple stones (32.3.264 etc.): carved hieroglyphic cartouches fill the frame, and the hieratic is a few small ink signs or not visible. That makes the gold ambiguous. The Tutankhamun embalming-cache linens and embalmers' dockets: only a few faint signs. Book of the Dead 25.3.29 and 25.3.32: not public domain, no image.
- **Met, dropped as duplicates of Wikimedia items.** 22.3.516 Heqanakht Letter I (same file as wm-0005), 26.3.165 Wisdom of Amenemope (wm-0038) and 21.2.122 Demotic Temple Oath (wm-0052). CBL Pap 1.2 recto is covered by wm-0023. Here the verso (cbl-0002) and a different sheet, Pap 1.5 (cbl-0001), are used instead.
- **Caveat, met-0014 (26.3.166).** The Met title says "Hieratic ostracon", but the record also comes up in a Met phrase search for "cursive hieroglyphs". The description could not be read. An expert should take a quick look.
- **Caveat, met-0029 (30.8.70a, Book of the Dead of Amenhotep).** The hand is cursive hieroglyphic. The Met tags it only "Hieroglyphs", so the gold is `hieroglyphic`, which is the same family in scoring.
- **Caveat, ypm-0002 (stela of Hornakht).** The museum calls the hand "cursive hieroglyphic text (a hybrid of hieroglyphic and hieratic forms)". This is a deliberate boundary case.
- `famous: true` is set only on the Papyrus Chester Beatty I sections (cbl-0001 to cbl-0003).
