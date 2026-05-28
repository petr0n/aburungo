/**
 * Compiles all phrase YAML files into a single typed, validated list.
 *
 * Add a new scenario by:
 *   1. Creating src/content/phrases/<scenario>.yaml
 *   2. Importing it below and pushing it into `allPhrases`
 *
 * The validator (parsePhrases) throws at module-load time on bad data, so a
 * broken phrase fails `npm run build` instead of breaking the live app.
 */
import type { Phrase } from "@/types";
import { parsePhrases } from "./schema";

import transitRaw from "./phrases/transit.yaml";
import restaurantRaw from "./phrases/restaurant.yaml";

export const allPhrases: Phrase[] = [
  ...parsePhrases(transitRaw, "phrases/transit.yaml"),
  ...parsePhrases(restaurantRaw, "phrases/restaurant.yaml"),
];

/** Lookup helper. O(n), fine for hundreds; reach for a Map if it grows large. */
export function findPhrase(id: string): Phrase | undefined {
  return allPhrases.find((p) => p.id === id);
}

/** Set of unique scenarios present in the content — for filtering UI later. */
export function listScenarios(): string[] {
  return Array.from(new Set(allPhrases.map((p) => p.scenario)));
}
