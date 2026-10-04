import { describe, expect, it } from "vitest";
import { allWords } from "../vocabulary";
import { books } from "../books";
import { allGlossaryEntries, bookThreeGates } from "./index";
import { allGrammarPatterns } from "../grammar";
import kcLibrary from "../../../data/reading/kc-yomyom.json";
import gvLibrary from "../../../data/reading/gv-passages.json";
import index from "../../../data/jmdict-index.json";

/** The literal pieces of a pattern, in order: ～を～れる is を then れる. */
const surfaceOf = (pattern: string): string[] => pattern.replace(/～/g, " ").trim().split(/\s+/).filter(Boolean);
/** Whether a sentence holds every piece, in the pattern's order. */
const holds = (sentence: string, frags: string[]): boolean => {
  let from = 0;
  for (const f of frags) {
    const at = sentence.indexOf(f, from);
    if (at < 0) return false;
    from = at + f.length;
  }
  return true;
};
import { parseGlossaryEntry, stemOf } from "./schema";

/**
 * The reading glossaries are authored against a generated library
 * (data/reading/kc-yomyom.json) and against the taught inventory. Both move,
 * so the cross-references are checked here rather than trusted.
 */
/** Both libraries: the KC stories, and the Global Voices gate passages. */
const stories = new Map<string, { id: string; sentences: { jpn: string }[] }>(
  [...kcLibrary.stories, ...gvLibrary.stories].map((s) => [s.id, s]),
);

/** The order of the first book that teaches each word. */
const firstBook = new Map<string, number>();
for (const book of books) {
  for (const lesson of book.lessons) {
    for (const id of lesson.wordIds) {
      const prev = firstBook.get(id);
      if (prev === undefined || book.order < prev) firstBook.set(id, book.order);
    }
  }
}
const words = new Map(allWords.map((w) => [w.id, w]));
const earlyWords = allWords.filter((w) => (firstBook.get(w.id) ?? 99) <= 3);
const taughtThroughBookThree = new Set(earlyWords.flatMap((w) => [w.japanese, w.reading]));
/**
 * The JMdict entries Books One to Three teach, by each word's own citation.
 * Spellings alone are not enough: Book One teaches なまえ in kana, so 名前 in a
 * story is the same entry in a form the learner has not met -- a spelling
 * entry, never a new one.
 */
const entriesByForm = new Map<string, string[]>();
for (const [seq, forms] of Object.entries(index.entries as Record<string, string[]>)) {
  for (const f of forms) entriesByForm.set(f, [...(entriesByForm.get(f) ?? []), seq]);
}
const taughtSeqs = new Set(
  earlyWords.flatMap((w) => {
    const cited = [...(w.notes ?? "").matchAll(/JMdict seq (\d{7})/g)].map((m) => m[1]);
    if (cited.length) return cited;
    // Much of Book One carries no citation. Where its spelling names exactly
    // one dictionary entry, that entry is the word; a homophone (はし: bridge,
    // chopsticks) names several, and is left out rather than guessed.
    const candidates = entriesByForm.get(w.japanese) ?? [];
    return candidates.length === 1 ? candidates : [];
  }),
);
const seqOf = (notes: string | undefined) => notes?.match(/JMdict seq (\d{7})/)?.[1];

describe("reading glossaries", () => {
  it("has entries to check, so the assertions below cannot pass vacuously", () => {
    expect(allGlossaryEntries.length).toBeGreaterThan(300);
  });

  it("credits every Global Voices passage, as CC BY requires", () => {
    const uncredited = gvLibrary.stories.filter((s) => !s.author || !s.translator || !s.link.startsWith("https://jp.globalvoices.org/"));
    expect(uncredited.map((s) => s.id)).toEqual([]);
    expect(gvLibrary.attribution.licence).toBe("CC BY 3.0");
  });

  it("gives every story in the library a glossary, and no glossary to a story that is not there", () => {
    const glossed = new Set(allGlossaryEntries.map((e) => e.story));
    expect([...glossed].sort()).toEqual([...stories.keys()].sort());
  });

  it("quotes every sentence verbatim from its own story", () => {
    // The sentence is the attestation. A paraphrase, or a sentence from the
    // wrong story, is a glossary word nobody can mine from where it claims to be.
    const bad = allGlossaryEntries.filter(
      (e) => !stories.get(e.story)?.sentences.some((s) => s.jpn === e.sentence),
    );
    expect(bad.map((e) => `${e.id}: ${e.sentence}`)).toEqual([]);
  });

  it("has no id twice across the whole library", () => {
    const seen = new Set<string>();
    const dupes = allGlossaryEntries.filter((e) => (seen.has(e.id) ? true : (seen.add(e.id), false)));
    expect(dupes.map((e) => e.id)).toEqual([]);
  });

  it("never offers as new a word Books One to Three already teach", () => {
    const stale = allGlossaryEntries.filter(
      (e) => e.kind === "new" && (taughtThroughBookThree.has(e.japanese) || taughtSeqs.has(seqOf(e.notes) ?? "")),
    );
    expect(stale.map((e) => `${e.id} ${e.japanese}`)).toEqual([]);
  });

  it("points a spelling entry at a word Books One to Three teach", () => {
    const bad = allGlossaryEntries
      .filter((e) => e.kind === "spelling")
      .filter((e) => !words.has(e.taughtId!) || (firstBook.get(e.taughtId!) ?? 99) > 3);
    expect(bad.map((e) => `${e.id} -> ${e.taughtId}`)).toEqual([]);
  });

  it("points a Book Four entry at a word Book Four is the first to teach", () => {
    // Pointing, never duplicating: the glossary does not move a word into Book
    // Three or change its tier gate, it only lets a reader look it up.
    const bad = allGlossaryEntries
      .filter((e) => e.kind === "book-four")
      .filter((e) => !words.has(e.taughtId!) || firstBook.get(e.taughtId!) !== 4);
    expect(bad.map((e) => `${e.id} -> ${e.taughtId}`)).toEqual([]);
  });

  it("is never referenced by a lesson -- reading vocabulary does not come from lessons", () => {
    const glossIds = new Set(allGlossaryEntries.map((e) => e.id));
    const leaked = books.flatMap((b) => b.lessons).filter((l) => l.wordIds.some((id) => glossIds.has(id)));
    expect(leaked.map((l) => l.id)).toEqual([]);
  });
});

describe("Book Three gate texts", () => {
  const bandIds = books.find((b) => b.order === 3)!.chapters.map((c) => c.id);
  const patterns = new Map(allGrammarPatterns.map((g) => [g.id, g]));

  it("closes every band with a passage -- no band is left without a gate text", () => {
    expect(bookThreeGates.filter((g) => g.story === null).map((g) => g.band)).toEqual([]);
  });

  it("accounts for every band exactly once, with a story or a stated reason", () => {
    expect(bookThreeGates.map((g) => g.band).sort()).toEqual([...bandIds].sort());
  });

  it("quotes its evidence verbatim from the gate story, and the pattern is in it", () => {
    const bad: string[] = [];
    for (const g of bookThreeGates) {
      if (g.story === null) continue;
      const story = stories.get(g.story);
      for (const e of g.evidence) {
        if (!story?.sentences.some((s) => s.jpn === e)) bad.push(`${g.band}: not verbatim: ${e}`);
      }
      for (const id of g.patterns) {
        const p = patterns.get(id);
        if (!p) { bad.push(`${g.band}: no pattern ${id}`); continue; }
        if (!id.startsWith("grammar.b3-")) bad.push(`${g.band}: ${id} is not a Book Three pattern`);
        const surface = surfaceOf(p.pattern);
        // A pattern ending in する conjugates in running text: ようにする is
        // ようにしましょう in the band-7 gate. Accept the する stem, nothing looser.
        const conjugated = surface.map((f) => (f.endsWith("する") ? f.slice(0, -2) + "し" : f));
        const found = (frags: string[]) => g.evidence.some((e) => holds(e, frags));
        if (!found(surface) && !found(conjugated)) bad.push(`${g.band}: ${id} absent from its evidence`);
      }
    }
    expect(bad).toEqual([]);
  });
});

describe("the glossary schema", () => {
  const ok = {
    id: "gloss.taro.1347880",
    story: "kc.taro",
    kind: "new",
    japanese: "小学生",
    reading: "しょうがくせい",
    english: "elementary school student",
    sentence: "太郎くんは小学生です。",
    notes: "JMdict seq 1347880.",
  };

  it("accepts a well-formed entry", () => {
    expect(parseGlossaryEntry(ok, "t").japanese).toBe("小学生");
  });

  it("refuses a word with no JMdict citation, but not a name", () => {
    expect(() => parseGlossaryEntry({ ...ok, notes: undefined }, "t")).toThrow(/JMdict seq/);
    expect(parseGlossaryEntry({ ...ok, kind: "name", notes: undefined }, "t").kind).toBe("name");
  });

  it("refuses a word its sentence does not contain", () => {
    expect(() => parseGlossaryEntry({ ...ok, japanese: "大学生" }, "t")).toThrow(/does not appear/);
  });

  it("finds an inflected word by its stem, and no looser", () => {
    expect(stemOf("逃げる")).toBe("逃げ"); // 逃げます
    expect(stemOf("美しい")).toBe("美し"); // 美しく
    expect(stemOf("勉強する")).toBe("勉強");
    expect(stemOf("神社")).toBe("神社");
  });

  it("requires a pointer on spelling and Book Four entries, and refuses one elsewhere", () => {
    expect(() => parseGlossaryEntry({ ...ok, kind: "spelling" }, "t")).toThrow(/taughtId/);
    expect(() => parseGlossaryEntry({ ...ok, taughtId: "vocab.x" }, "t")).toThrow(/cannot carry/);
  });
});
