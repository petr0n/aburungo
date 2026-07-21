import type { JlptLevel, Word, UserTier } from "@/types";
import { parseWords } from "./schema";

import basicsRaw from "./basics.yaml";
import nounsRaw from "./nouns.yaml";
import verbsRaw from "./verbs.yaml";
import adjectivesRaw from "./adjectives.yaml";
import greetings2Raw from "./greetings-2.yaml";
import foodDrinkRaw from "./food-drink.yaml";
import shoppingRaw from "./shopping.yaml";
import transitRaw from "./transit.yaml";
import hotelRaw from "./hotel.yaml";
import directionsRaw from "./directions.yaml";
import weatherRaw from "./weather.yaml";
import foodPreferencesRaw from "./food-preferences.yaml";

export const allWords: Word[] = [
  ...parseWords(basicsRaw, "vocabulary/basics.yaml"),
  ...parseWords(nounsRaw, "vocabulary/nouns.yaml"),
  ...parseWords(verbsRaw, "vocabulary/verbs.yaml"),
  ...parseWords(adjectivesRaw, "vocabulary/adjectives.yaml"),
  ...parseWords(greetings2Raw, "vocabulary/greetings-2.yaml"),
  ...parseWords(foodDrinkRaw, "vocabulary/food-drink.yaml"),
  ...parseWords(shoppingRaw, "vocabulary/shopping.yaml"),
  ...parseWords(transitRaw, "vocabulary/transit.yaml"),
  ...parseWords(hotelRaw, "vocabulary/hotel.yaml"),
  ...parseWords(directionsRaw, "vocabulary/directions.yaml"),
  ...parseWords(weatherRaw, "vocabulary/weather.yaml"),
  ...parseWords(foodPreferencesRaw, "vocabulary/food-preferences.yaml"),
];

export function findWord(id: string): Word | undefined {
  return allWords.find((w) => w.id === id);
}

/** Group all words by their theme label. */
export function wordsByTheme(): Map<string, Word[]> {
  const map = new Map<string, Word[]>();
  for (const w of allWords) {
    const theme = w.theme ?? "other";
    const existing = map.get(theme);
    if (existing !== undefined) {
      existing.push(w);
    } else {
      map.set(theme, [w]);
    }
  }
  return map;
}

const TIER_LEVELS: Record<UserTier, Set<JlptLevel>> = {
  guest: new Set(["N5"]),
  free: new Set(["N5", "N4"]),
  paid: new Set(["N5", "N4", "N3", "N2", "N1"]),
};

export function wordsForTier(tier: UserTier): Word[] {
  const allowed = TIER_LEVELS[tier];
  return allWords.filter((w) => allowed.has(w.jlpt ?? "N5"));
}
