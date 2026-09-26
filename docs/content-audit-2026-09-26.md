# Content audit — 26 September 2026

The preview’s `src/data/catalog.ts` was checked entry by entry against `docs/source`. The result is `packages/content/src/catalog.ts`. `pnpm --filter @shookuku/content check` enforces the rules below on every change.

## Rules applied

1. **Status only with a source sentence.** An entry may be `living`, `fading`, or `historical` only when a sentence in its source paper says so. That sentence is stored verbatim in `statusBasis` and shown on the story page. Everything else is `unspecified` (“Status not stated”). Present-tense description alone is not enough; past-tense narration alone is not enough for “historical”.
2. **No claim the source does not make.** Where a teaser added meaning not in the papers, it was cut or replaced with the author’s own point.
3. **No Oshiwambo term the source does not use.**

## Statuses

| Entry | Preview | Now | Basis |
|---|---|---|---|
| cattle | fading | **living** | “Omaludi eengobe is now practiced with vibrancy and is even recognized by modern authorities” (rituals) |
| omitima | historical | **living** | “This feast is enjoyed by several Aawambo even today.” (rituals) |
| preferential | historical | **fading** | “In modern times, marriage among cross cousins is rare.” (kinship) |
| wedding | living | living | clan-emblem t-shirts and headdresses “becoming a common occurrence during the wedding ceremony” (marriage) |
| all other 22 | living / fading / historical | unspecified | no sentence in the source states current practice |

Candidates for the professor: the ethnobotany paper says of omugolo bark rings on newborns, “This is an old tradition, but some people still practise it today,” and of omusati, “In modern times, the omusati is important during Christmas time.” These describe one use each, not the whole entry, so the entries stay unspecified until he says otherwise.

## Content corrections

| Entry | Change | Why |
|---|---|---|
| initiation | Retitled “Initiation of girls”; osh `Efunditho` → `Efundula / olufuko`; teaser now: girls before marriage, Namunganga’s house, four days | Source describes a girls’ pre-marriage ceremony; “Efunditho” appears nowhere |
| naming | osh `Etumo` removed; teaser shows both accounts (midwife in homestead paper, father in ritual record) | “Etumo” appears nowhere; the two papers differ on who names the child |
| twins | Bad omen; hut in the mahangu field; healer and both clans; midwife removed | Midwife not in source; location was wrong |
| oshipe | id `oship` → `oshipe`; thanksgiving after winnowing, ancestors first | Typo; “thanks the work of the fields” was loose |
| cattle | End of April after the rains; purpose is encouraging herders | “kinship” in purpose not in source |
| omitima | Honours a parallel cousin of the same clan | “each cut has its own gathering” overstated |
| mourning | Durations and the mourning fire; purpose from source (“life after death”) | “restraint”, “set right” not in source |
| healing | Omugolo removed; ancestors as the cause, per source | Omugolo medicine is in ethnobotany, not the healing ceremony |
| oshoto | Soldiers’ place named oshoto shiita; “counsel” → story and play | Terms and purpose from source |
| oshigunda | “Same moral fence as the people” removed; sections of the kraal added | Invented phrase |
| wedding | “hall” removed; banns in church, flags at the bride’s home; cites both papers | “hall” not in source |
| aakwetu | Specific labels softened to the author’s grading | Kept the point without mislabelling terms |
| address | Adds kuku; mother’s brother may be called meme; the three dialects treated separately | Source detail |
| clan-father | ongudhi yezimo (pillar) and shimutsikeni (arbitrator); “ritual” and “clan gathering” removed | Not in source |
| visitor | “In the spirit of omugolo” removed; ehale and *Mwa galuka?* from the greetings paper | The omugolo link was an inference across papers |
| morning | Retitled “Greetings through the day” | Covers all four windows |

## Collection names

The preview gave Oshiwambo subtitles to four collections — *Ehokololo*, *Aakwetu noludhi*, *Iimeno*, *Epopilo* — that do not appear in any source paper. They are removed until the professor supplies his preferred terms. *Egumbo* (homestead) appears in the sources and stays. *Omuthigululwakalo* is the core book’s title and is no longer used as a collection label.

## Counts

The source papers cover 17 ceremonies, 14 homestead places, and 13 greeting situations. The preview holds 9, 5, and 3 teasers. The site shows the true ratio (“5 of 14 places in this preview”). No entries were invented to fill the gap.

The brief mentions 16 bibliography titles; the catalog holds 12. The bookstore shows 12 until the other four are supplied.

## Questions for Professor Mbenzi

1. Who names the child — the midwife (homestead paper) or the father (ritual record)? Or both, at different moments?
2. Oshiwambo titles for the marriage, kinship, plants, and greetings collections.
3. The census sentence in *The description of Aawambo 2026* is cut off (“approximately 50% of Namibia’s total of the They speak…”). The site says “approximately half of Namibia’s population”; please confirm.
4. The kinship paper says Oshimbadja, Oshimbaanhu, and Oshikwanyama terms “will be presented in the next subsection”, which is not in the file. Is there a missing section? (Also: the dialect list spells *Oshimbalantu*; the kinship paper *Oshimbaanhu*.)
5. The kinship file repeats its whole text twice — likely a conversion artefact; re-export if possible.
6. Section 1.14 of the homestead paper (ondunda yomatemo, the hoe store) has a heading but no text.
7. The four missing bibliography titles.
8. Which statuses he wants to state for the 22 entries now marked “Status not stated”.
