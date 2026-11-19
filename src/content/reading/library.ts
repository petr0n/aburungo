/**
 * The reading library as the app shows it: every KC よむよむ story and Global
 * Voices passage, in reading order, joined to its glossary.
 *
 * Imported only by the lazily loaded reader page, so the two story files
 * (~200 KB) stay out of the main bundle.
 */
import type { GlossaryEntry } from "@/types";
import { allGlossaryEntries } from "./index";
import kc from "../../../data/reading/kc-yomyom.json";
import gv from "../../../data/reading/gv-passages.json";

export type ReadingText = {
  id: string;
  title: string;
  /** "A1", "A2", "A2/B1" for stories; "news" for passages. */
  level: string;
  sentences: string[];
  glossary: GlossaryEntry[];
  /** Licence credit, shown wherever the text is. GV requires author, translator and link. */
  credit: { text: string; link: string; licence: string; licenceUrl: string };
};

const glossaryByText = new Map<string, GlossaryEntry[]>();
for (const e of allGlossaryEntries) glossaryByText.set(e.story, [...(glossaryByText.get(e.story) ?? []), e]);

const LEVEL_ORDER = ["A1", "A2", "A2/B1"];

export const stories: ReadingText[] = [...kc.stories]
  .sort((a, z) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(z.level))
  .map((s) => ({
    id: s.id,
    title: s.title,
    level: s.level,
    sentences: s.sentences.map((x) => x.jpn),
    glossary: glossaryByText.get(s.id) ?? [],
    credit: { text: kc.attribution.source, link: kc.attribution.sourceUrl, licence: kc.attribution.licence, licenceUrl: kc.attribution.licenceUrl },
  }));

export const passages: ReadingText[] = gv.stories.map((p) => ({
  id: p.id,
  title: p.title,
  level: p.level,
  sentences: p.sentences.map((x) => x.jpn),
  glossary: glossaryByText.get(p.id) ?? [],
  credit: {
    text: `By ${p.author}, translated by ${p.translator}, Global Voices 日本語`,
    link: p.link,
    licence: gv.attribution.licence,
    licenceUrl: gv.attribution.licenceUrl,
  },
}));

export function findText(id: string): ReadingText | undefined {
  return [...stories, ...passages].find((t) => t.id === id);
}

/**
 * The glossary words a sentence uses: the entry was taken from this sentence,
 * or its headword appears in it. Conjugated verbs only match the sentence they
 * were taken from -- there is no morphological analyser -- so the reader also
 * lists the whole glossary after the text.
 */
export function glossaryFor(sentence: string, glossary: readonly GlossaryEntry[]): GlossaryEntry[] {
  return glossary.filter((e) => e.sentence === sentence || sentence.includes(e.japanese));
}
