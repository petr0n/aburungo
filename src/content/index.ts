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
import greetingsRaw from "./phrases/greetings.yaml";
import shoppingRaw from "./phrases/shopping.yaml";
import hotelRaw from "./phrases/hotel.yaml";
import directionsRaw from "./phrases/directions.yaml";
import basicsRaw from "./phrases/basics.yaml";
import weatherRaw from "./phrases/weather.yaml";
import foodPreferencesRaw from "./phrases/food-preferences.yaml";
import datesPhrasesRaw from "./phrases/dates.yaml";
import relativeTimePhrasesRaw from "./phrases/relative-time.yaml";
import familyPhrasesRaw from "./phrases/family.yaml";
import homeWorkPhrasesRaw from "./phrases/home-work.yaml";
import teFormPhrasesRaw from "./phrases/te-form.yaml";
import countingPhrasesRaw from "./phrases/counting.yaml";
import describingPhrasesRaw from "./phrases/describing.yaml";
import aroundTownPhrasesRaw from "./phrases/around-town.yaml";
import pastTensePhrasesRaw from "./phrases/past-tense.yaml";
import mealsPhrasesRaw from "./phrases/meals.yaml";
import peopleClothesPhrasesRaw from "./phrases/people-clothes.yaml";
import b2PlainFormPhrasesRaw from "./phrases/b2-plain-form.yaml";

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
  ...parsePhrases(datesPhrasesRaw, "phrases/dates.yaml"),
  ...parsePhrases(relativeTimePhrasesRaw, "phrases/relative-time.yaml"),
  ...parsePhrases(familyPhrasesRaw, "phrases/family.yaml"),
  ...parsePhrases(homeWorkPhrasesRaw, "phrases/home-work.yaml"),
  ...parsePhrases(teFormPhrasesRaw, "phrases/te-form.yaml"),
  ...parsePhrases(countingPhrasesRaw, "phrases/counting.yaml"),
  ...parsePhrases(describingPhrasesRaw, "phrases/describing.yaml"),
  ...parsePhrases(aroundTownPhrasesRaw, "phrases/around-town.yaml"),
  ...parsePhrases(pastTensePhrasesRaw, "phrases/past-tense.yaml"),
  ...parsePhrases(mealsPhrasesRaw, "phrases/meals.yaml"),
  ...parsePhrases(peopleClothesPhrasesRaw, "phrases/people-clothes.yaml"),
  ...parsePhrases(b2PlainFormPhrasesRaw, "phrases/b2-plain-form.yaml"),
];

// parsePhrases only rejects duplicate ids within a single file, so the same id in
// two files would slip through and findPhrase would silently return whichever
// loaded first. The word collection has had this guard since vocab.asa was added
// to basics-2.yaml while it already existed in transit.yaml; phrases never got it,
// and this file gains a new phrase file every chapter.
const seenPhraseIds = new Set<string>();
for (const p of allPhrases) {
  if (seenPhraseIds.has(p.id)) {
    throw new Error(`phrases: duplicate phrase id "${p.id}" across files`);
  }
  seenPhraseIds.add(p.id);
}

/** Lookup helper. O(n), fine for hundreds; reach for a Map if it grows large. */
export function findPhrase(id: string): Phrase | undefined {
  return allPhrases.find((p) => p.id === id);
}

/** Set of unique scenarios present in the content — for filtering UI later. */
export function listScenarios(): string[] {
  return Array.from(new Set(allPhrases.map((p) => p.scenario)));
}
