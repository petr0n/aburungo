import type { JlptLevel, Word, UserTier } from "@/types";
import { parseWords } from "./schema";

import basicsRaw from "./basics.yaml";
import basics2Raw from "./basics-2.yaml";
import nounsRaw from "./nouns.yaml";
import verbsRaw from "./verbs.yaml";
import adjectivesRaw from "./adjectives.yaml";
import greetings2Raw from "./greetings-2.yaml";
import foodDrinkRaw from "./food-drink.yaml";
import foodDrink2Raw from "./food-drink-2.yaml";
import shoppingRaw from "./shopping.yaml";
import shopping2Raw from "./shopping-2.yaml";
import transitRaw from "./transit.yaml";
import transit2Raw from "./transit-2.yaml";
import hotelRaw from "./hotel.yaml";
import places2Raw from "./places-2.yaml";
import datesRaw from "./dates.yaml";
import relativeTimeRaw from "./relative-time.yaml";
import directionsRaw from "./directions.yaml";
import weatherRaw from "./weather.yaml";
import foodPreferencesRaw from "./food-preferences.yaml";
import familyRaw from "./family.yaml";
import homeWorkRaw from "./home-work.yaml";
import teFormRaw from "./te-form.yaml";
import countingRaw from "./counting.yaml";
import describingRaw from "./describing.yaml";

export const allWords: Word[] = [
  ...parseWords(basicsRaw, "vocabulary/basics.yaml"),
  ...parseWords(basics2Raw, "vocabulary/basics-2.yaml"),
  ...parseWords(nounsRaw, "vocabulary/nouns.yaml"),
  ...parseWords(verbsRaw, "vocabulary/verbs.yaml"),
  ...parseWords(adjectivesRaw, "vocabulary/adjectives.yaml"),
  ...parseWords(greetings2Raw, "vocabulary/greetings-2.yaml"),
  ...parseWords(foodDrinkRaw, "vocabulary/food-drink.yaml"),
  ...parseWords(foodDrink2Raw, "vocabulary/food-drink-2.yaml"),
  ...parseWords(shoppingRaw, "vocabulary/shopping.yaml"),
  ...parseWords(shopping2Raw, "vocabulary/shopping-2.yaml"),
  ...parseWords(transitRaw, "vocabulary/transit.yaml"),
  ...parseWords(transit2Raw, "vocabulary/transit-2.yaml"),
  ...parseWords(hotelRaw, "vocabulary/hotel.yaml"),
  ...parseWords(places2Raw, "vocabulary/places-2.yaml"),
  ...parseWords(datesRaw, "vocabulary/dates.yaml"),
  ...parseWords(relativeTimeRaw, "vocabulary/relative-time.yaml"),
  ...parseWords(directionsRaw, "vocabulary/directions.yaml"),
  ...parseWords(weatherRaw, "vocabulary/weather.yaml"),
  ...parseWords(foodPreferencesRaw, "vocabulary/food-preferences.yaml"),
  ...parseWords(familyRaw, "vocabulary/family.yaml"),
  ...parseWords(homeWorkRaw, "vocabulary/home-work.yaml"),
  ...parseWords(teFormRaw, "vocabulary/te-form.yaml"),
  ...parseWords(countingRaw, "vocabulary/counting.yaml"),
  ...parseWords(describingRaw, "vocabulary/describing.yaml"),
];

// parseWords only rejects duplicate ids within a single file, so the same id in
// two files used to slip through and findWord would silently return whichever
// loaded first. Caught in practice: vocab.asa was added to basics-2.yaml when it
// already existed in transit.yaml.
const seenIds = new Set<string>();
for (const w of allWords) {
  if (seenIds.has(w.id)) {
    throw new Error(`vocabulary: duplicate word id "${w.id}" across files`);
  }
  seenIds.add(w.id);
}

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
