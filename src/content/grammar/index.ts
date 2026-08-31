/**
 * Compiles grammar-pattern YAML into a single typed, validated list.
 *
 * Add a new pattern file by creating src/content/grammar/<path>.yaml and
 * pushing it into `allGrammarPatterns` below — mirrors src/content/lessons/index.ts.
 * One flat list across every book, unlike lessons: a pattern is looked up by id
 * and never asked which book it came from.
 */
import type { GrammarPattern } from "@/types";
import { parseGrammarPatterns } from "./schema";
import { allPhrases } from "@/content/index";

import n5Raw from "./n5.yaml";
import b2PlainFormRaw from "./b2-01-plain-form.yaml";

const phrasesById = new Map(allPhrases.map((p) => [p.id, p]));

export const allGrammarPatterns: GrammarPattern[] = [
  ...parseGrammarPatterns(n5Raw, "grammar/n5.yaml", phrasesById),
  ...parseGrammarPatterns(b2PlainFormRaw, "grammar/b2-01-plain-form.yaml", phrasesById),
];

export function findGrammarPattern(id: string): GrammarPattern | undefined {
  return allGrammarPatterns.find((p) => p.id === id);
}
