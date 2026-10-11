// Types for the parts of levelling.mjs that TypeScript tests import.
export type Lexicon = { forms: Map<string, string[]>; maxLen: number; dictForms: unknown };
export type Token = { kind: "item" | "structural" | "unknown" | "other"; text: string; itemIds?: string[] };
export function buildLexicon(
  words: ReadonlyArray<{ id: string; japanese: string; reading: string }>,
  dictForms: unknown,
): Lexicon;
export function tokenize(jpn: string, lexicon: Lexicon): Token[];
