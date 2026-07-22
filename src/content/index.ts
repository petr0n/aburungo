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
import type { JlptLevel, Phrase, UserTier } from "@/types";
import { parsePhrases } from "./schema";

import transitRaw from "./phrases/transit.yaml";
import restaurantRaw from "./phrases/restaurant.yaml";
import greetingsRaw from "./phrases/greetings.yaml";
import shoppingRaw from "./phrases/shopping.yaml";
import hotelRaw from "./phrases/hotel.yaml";
import directionsRaw from "./phrases/directions.yaml";
import basicsRaw from "./phrases/basics.yaml";
import weatherRaw from "./phrases/weather.yaml";
import foodPreferencesRaw from "./phrases/food-preferences.yaml";

export const allPhrases: Phrase[] = [
  ...parsePhrases(transitRaw, "phrases/transit.yaml"),
  ...parsePhrases(restaurantRaw, "phrases/restaurant.yaml"),
  ...parsePhrases(greetingsRaw, "phrases/greetings.yaml"),
  ...parsePhrases(shoppingRaw, "phrases/shopping.yaml"),
  ...parsePhrases(hotelRaw, "phrases/hotel.yaml"),
  ...parsePhrases(directionsRaw, "phrases/directions.yaml"),
  ...parsePhrases(basicsRaw, "phrases/basics.yaml"),
  ...parsePhrases(weatherRaw, "phrases/weather.yaml"),
  ...parsePhrases(foodPreferencesRaw, "phrases/food-preferences.yaml"),
];

/** Lookup helper. O(n), fine for hundreds; reach for a Map if it grows large. */
export function findPhrase(id: string): Phrase | undefined {
  return allPhrases.find((p) => p.id === id);
}

/** Set of unique scenarios present in the content — for filtering UI later. */
export function listScenarios(): string[] {
  return Array.from(new Set(allPhrases.map((p) => p.scenario)));
}

/**
 * Allowed JLPT levels per user tier.
 *
 *   guest  → N5 only (no account)
 *   free   → N5 + N4 (free account)
 *   paid   → all levels
 *
 * Phrases without a jlpt tag are treated as N5 (legacy content).
 */
const TIER_LEVELS: Record<UserTier, Set<JlptLevel>> = {
  guest: new Set(["N5"]),
  free: new Set(["N5", "N4"]),
  paid: new Set(["N5", "N4", "N3", "N2", "N1"]),
};

export function phrasesForTier(tier: UserTier): Phrase[] {
  const allowed = TIER_LEVELS[tier];
  return allPhrases.filter((p) => allowed.has(p.jlpt ?? "N5"));
}
