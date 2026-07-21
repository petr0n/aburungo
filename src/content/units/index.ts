/**
 * Compiles unit YAML into a single typed, validated, order-sorted list.
 *
 * Add a new unit file by creating src/content/units/<path>.yaml and pushing
 * it into `n5Units` below (or a new export, for N4+ ladders later).
 */
import type { Unit } from "@/types";
import { parseUnits } from "./schema";
import { allWords } from "@/content/vocabulary";
import { allPhrases } from "@/content/index";

import n5Raw from "./n5.yaml";

const knownWordIds = new Set(allWords.map((w) => w.id));
const knownPhraseIds = new Set(allPhrases.map((p) => p.id));

export const n5Units: Unit[] = parseUnits(n5Raw, "units/n5.yaml", knownWordIds, knownPhraseIds);

export function findUnit(id: string): Unit | undefined {
  return n5Units.find((u) => u.id === id);
}
