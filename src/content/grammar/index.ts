/**
 * Compiles grammar-pattern YAML into a single typed, validated list.
 *
 * Add a new pattern file by creating src/content/grammar/<path>.yaml and
 * pushing it into `allGrammarPatterns` below (or a new export, for N4+
 * ladders later) — mirrors src/content/lessons/index.ts.
 */
import type { GrammarPattern } from "@/types";
import { parseGrammarPatterns } from "./schema";
import { allPhrases } from "@/content/index";

import n5Raw from "./n5.yaml";

const phrasesById = new Map(allPhrases.map((p) => [p.id, p]));

export const allGrammarPatterns: GrammarPattern[] = [...parseGrammarPatterns(n5Raw, "grammar/n5.yaml", phrasesById)];

export function findGrammarPattern(id: string): GrammarPattern | undefined {
  return allGrammarPatterns.find((p) => p.id === id);
}
