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
import b2PlainFormPhrasesRaw from "./phrases/b2-01-plain-form.yaml";
import b2GivingReceivingPhrasesRaw from "./phrases/b2-02-giving-receiving.yaml";
import b2JoiningSentencesPhrasesRaw from "./phrases/b2-03-joining-sentences.yaml";
import b2DoctorPhrasesRaw from "./phrases/b2-04-doctor.yaml";
import b2DecidingPhrasesRaw from "./phrases/b2-05-deciding.yaml";
import b2PotentialPhrasesRaw from "./phrases/b2-06-potential.yaml";
import b2QuotedSpeechPhrasesRaw from "./phrases/b2-07-quoted-speech.yaml";
import b2MakingPlansPhrasesRaw from "./phrases/b2-08-making-plans.yaml";
import b2ConditionalsPhrasesRaw from "./phrases/b2-09-conditionals.yaml";
import b2TroublePhrasesRaw from "./phrases/b2-10-trouble.yaml";
import b3PassivePhrasesRaw from "./phrases/b3-00-passive.yaml";
import b3CausePhrasesRaw from "./phrases/b3-01-cause.yaml";
import b3ContrastPhrasesRaw from "./phrases/b3-02-contrast.yaml";
import b3ConditionsPhrasesRaw from "./phrases/b3-03-conditions.yaml";
import b3TimePhrasesRaw from "./phrases/b3-04-time.yaml";
import b3StancePhrasesRaw from "./phrases/b3-05-stance.yaml";
import b3DegreePhrasesRaw from "./phrases/b3-06-degree.yaml";
import b3PurposePhrasesRaw from "./phrases/b3-07-purpose.yaml";
import b3ObligationPhrasesRaw from "./phrases/b3-08-obligation.yaml";
import b3ReferencePhrasesRaw from "./phrases/b3-09-reference.yaml";
import b3RegisterPhrasesRaw from "./phrases/b3-10-register.yaml";
import b4FinishingPhrasesRaw from "./phrases/b4-00-finishing.yaml";
import b4MeaningPhrasesRaw from "./phrases/b4-01-meaning.yaml";
import b4ReasonPhrasesRaw from "./phrases/b4-02-reason.yaml";
import b4TalkPhrasesRaw from "./phrases/b4-03-talk.yaml";
import b4KeigoHumblePhrasesRaw from "./phrases/b4-04-keigo-humble.yaml";
import b4KeigoHonorificPhrasesRaw from "./phrases/b4-05-keigo-honorific.yaml";
import b4RelationPhrasesRaw from "./phrases/b4-06-relation.yaml";
import b4ExceptionPhrasesRaw from "./phrases/b4-07-exception.yaml";
import b4ConjunctionPhrasesRaw from "./phrases/b4-08-conjunction.yaml";

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
  ...parsePhrases(b2PlainFormPhrasesRaw, "phrases/b2-01-plain-form.yaml"),
  ...parsePhrases(b2GivingReceivingPhrasesRaw, "phrases/b2-02-giving-receiving.yaml"),
  ...parsePhrases(b2JoiningSentencesPhrasesRaw, "phrases/b2-03-joining-sentences.yaml"),
  ...parsePhrases(b2DoctorPhrasesRaw, "phrases/b2-04-doctor.yaml"),
  ...parsePhrases(b2DecidingPhrasesRaw, "phrases/b2-05-deciding.yaml"),
  ...parsePhrases(b2PotentialPhrasesRaw, "phrases/b2-06-potential.yaml"),
  ...parsePhrases(b2QuotedSpeechPhrasesRaw, "phrases/b2-07-quoted-speech.yaml"),
  ...parsePhrases(b2MakingPlansPhrasesRaw, "phrases/b2-08-making-plans.yaml"),
  ...parsePhrases(b2ConditionalsPhrasesRaw, "phrases/b2-09-conditionals.yaml"),
  ...parsePhrases(b2TroublePhrasesRaw, "phrases/b2-10-trouble.yaml"),
  ...parsePhrases(b3PassivePhrasesRaw, "phrases/b3-00-passive.yaml"),
  ...parsePhrases(b3CausePhrasesRaw, "phrases/b3-01-cause.yaml"),
  ...parsePhrases(b3ContrastPhrasesRaw, "phrases/b3-02-contrast.yaml"),
  ...parsePhrases(b3ConditionsPhrasesRaw, "phrases/b3-03-conditions.yaml"),
  ...parsePhrases(b3TimePhrasesRaw, "phrases/b3-04-time.yaml"),
  ...parsePhrases(b3StancePhrasesRaw, "phrases/b3-05-stance.yaml"),
  ...parsePhrases(b3DegreePhrasesRaw, "phrases/b3-06-degree.yaml"),
  ...parsePhrases(b3PurposePhrasesRaw, "phrases/b3-07-purpose.yaml"),
  ...parsePhrases(b3ObligationPhrasesRaw, "phrases/b3-08-obligation.yaml"),
  ...parsePhrases(b3ReferencePhrasesRaw, "phrases/b3-09-reference.yaml"),
  ...parsePhrases(b3RegisterPhrasesRaw, "phrases/b3-10-register.yaml"),
  ...parsePhrases(b4FinishingPhrasesRaw, "phrases/b4-00-finishing.yaml"),
  ...parsePhrases(b4MeaningPhrasesRaw, "phrases/b4-01-meaning.yaml"),
  ...parsePhrases(b4ReasonPhrasesRaw, "phrases/b4-02-reason.yaml"),
  ...parsePhrases(b4TalkPhrasesRaw, "phrases/b4-03-talk.yaml"),
  ...parsePhrases(b4KeigoHumblePhrasesRaw, "phrases/b4-04-keigo-humble.yaml"),
  ...parsePhrases(b4KeigoHonorificPhrasesRaw, "phrases/b4-05-keigo-honorific.yaml"),
  ...parsePhrases(b4RelationPhrasesRaw, "phrases/b4-06-relation.yaml"),
  ...parsePhrases(b4ExceptionPhrasesRaw, "phrases/b4-07-exception.yaml"),
  ...parsePhrases(b4ConjunctionPhrasesRaw, "phrases/b4-08-conjunction.yaml"),
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
