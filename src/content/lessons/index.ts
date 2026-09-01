/**
 * Compiles lesson YAML into a single typed, validated, order-sorted list.
 *
 * One export per book, because a book's ladder is its own: `n5Lessons` is Book
 * One's and `b2Lessons` is Book Two's. Add a lesson file by creating
 * src/content/lessons/<path>.yaml and pushing it into the export for the book
 * whose chapters it belongs to.
 */
import type { Lesson } from "@/types";
import { hanaEnabled } from "@/config";
import { parseLessons } from "./schema";
import { allWords } from "@/content/vocabulary";
import { allPhrases } from "@/content/index";
import { allGrammarPatterns } from "@/content/grammar";
import { n5ChapterIds, b2ChapterIds } from "@/content/chapters";

import n5Raw from "./n5.yaml";
import n5GreetingsContRaw from "./n5-01-greetings-cont.yaml";
import n5FoodDrinkRaw from "./n5-02-food-drink.yaml";
import n5ShoppingRaw from "./n5-03-shopping.yaml";
import n5TransitRaw from "./n5-04-transit.yaml";
import n5HotelRaw from "./n5-05-hotel.yaml";
import n5Checkpoint1Raw from "./n5-02b-checkpoint-1.yaml";
import n5Checkpoint2Raw from "./n5-04b-checkpoint-2.yaml";
import n5Checkpoint3Raw from "./n5-07b-checkpoint-3.yaml";
import n5DirectionsRaw from "./n5-06-directions.yaml";
import n5WeatherRaw from "./n5-07-weather.yaml";
import n5IntegrationRaw from "./n5-08-integration.yaml";
import n5DatesRaw from "./n5-09-dates.yaml";
import n5CheckpointRaw from "./n5-10-checkpoint.yaml";
import n5RelativeTimeRaw from "./n5-11-relative-time.yaml";
import n5FinalCheckpointRaw from "./n5-12-final-checkpoint.yaml";
import n5ProductionCheckpointRaw from "./n5-13-production-checkpoint.yaml";
import n5FamilyRaw from "./n5-14-family.yaml";
import n5HomeWorkRaw from "./n5-15-home-work.yaml";
import n5TeFormRaw from "./n5-16-te-form.yaml";
import n5CountingRaw from "./n5-17-counting.yaml";
import n5DescribingRaw from "./n5-18-describing.yaml";
import n5AroundTownRaw from "./n5-19-around-town.yaml";
import n5PastTenseRaw from "./n5-20-past-tense.yaml";
import n5MealsRaw from "./n5-21-meals.yaml";
import n5PeopleClothesRaw from "./n5-22-people-clothes.yaml";
import b2PlainFormRaw from "./b2-01-plain-form.yaml";
import b2GivingReceivingRaw from "./b2-02-giving-receiving.yaml";
import b2JoiningSentencesRaw from "./b2-03-joining-sentences.yaml";
import b2DoctorRaw from "./b2-04-doctor.yaml";
import b2DecidingRaw from "./b2-05-deciding.yaml";
import b2PotentialRaw from "./b2-06-potential.yaml";
import b2QuotedSpeechRaw from "./b2-07-quoted-speech.yaml";
import b2MakingPlansRaw from "./b2-08-making-plans.yaml";
import b2ConditionalsRaw from "./b2-09-conditionals.yaml";
import b2TroubleRaw from "./b2-10-trouble.yaml";

const knownWordIds = new Set(allWords.map((w) => w.id));
const knownPhraseIds = new Set(allPhrases.map((p) => p.id));
const knownPatternIds = new Set(allGrammarPatterns.map((p) => p.id));

export const n5Lessons: Lesson[] = [
  ...parseLessons(n5Raw, "lessons/n5.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5GreetingsContRaw, "lessons/n5-01-greetings-cont.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5FoodDrinkRaw, "lessons/n5-02-food-drink.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5ShoppingRaw, "lessons/n5-03-shopping.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5TransitRaw, "lessons/n5-04-transit.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5HotelRaw, "lessons/n5-05-hotel.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5Checkpoint1Raw, "lessons/n5-02b-checkpoint-1.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5Checkpoint2Raw, "lessons/n5-04b-checkpoint-2.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5Checkpoint3Raw, "lessons/n5-07b-checkpoint-3.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5DirectionsRaw, "lessons/n5-06-directions.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5WeatherRaw, "lessons/n5-07-weather.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5IntegrationRaw, "lessons/n5-08-integration.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5DatesRaw, "lessons/n5-09-dates.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5CheckpointRaw, "lessons/n5-10-checkpoint.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5RelativeTimeRaw, "lessons/n5-11-relative-time.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5FinalCheckpointRaw, "lessons/n5-12-final-checkpoint.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5ProductionCheckpointRaw, "lessons/n5-13-production-checkpoint.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5FamilyRaw, "lessons/n5-14-family.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5HomeWorkRaw, "lessons/n5-15-home-work.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5TeFormRaw, "lessons/n5-16-te-form.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5CountingRaw, "lessons/n5-17-counting.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5DescribingRaw, "lessons/n5-18-describing.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5AroundTownRaw, "lessons/n5-19-around-town.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5PastTenseRaw, "lessons/n5-20-past-tense.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5MealsRaw, "lessons/n5-21-meals.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
  ...parseLessons(n5PeopleClothesRaw, "lessons/n5-22-people-clothes.yaml", knownWordIds, knownPhraseIds, knownPatternIds, n5ChapterIds),
]
  .sort((a, b) => a.order - b.order)
  /**
   * Hana lessons leave the ladder entirely when the AI is shelved (DR-023).
   *
   * Filtering here rather than in LearnPage is what keeps the rest of the app
   * from needing to know Hana exists: the orchestrator, the step router, the
   * can-do helpers and the walkthrough all see one consistent ladder that
   * simply ends at the production checkpoint. Gating further down would leave the lessons on the
   * ladder as screens that apologise for themselves — the exact dead end
   * DR-022 was written to remove.
   *
   * Keyed off the checkpoint kind rather than a list of ids, so a Hana lesson
   * added later is covered without touching this.
   */
  .filter((u) => hanaEnabled || (u.checkpoint !== "conversation" && u.checkpoint !== "can-do"));

/**
 * Book Two. Orders continue Book One's rather than restarting: they are global
 * across the course, because scripts/kanji.mjs sorts every lesson file by
 * `order` with no idea which book a lesson came from. Sorted here for the same
 * reason n5Lessons is: chapter files land out of order and the ladder is the
 * `order` sequence, not the import list.
 *
 * No Hana filter here, unlike n5Lessons: nothing in this book is gated on the
 * shelved AI. Add one if that ever changes.
 */
export const b2Lessons: Lesson[] = [
  ...parseLessons(b2PlainFormRaw, "lessons/b2-01-plain-form.yaml", knownWordIds, knownPhraseIds, knownPatternIds, b2ChapterIds),
  ...parseLessons(b2GivingReceivingRaw, "lessons/b2-02-giving-receiving.yaml", knownWordIds, knownPhraseIds, knownPatternIds, b2ChapterIds),
  ...parseLessons(b2JoiningSentencesRaw, "lessons/b2-03-joining-sentences.yaml", knownWordIds, knownPhraseIds, knownPatternIds, b2ChapterIds),
  ...parseLessons(b2DoctorRaw, "lessons/b2-04-doctor.yaml", knownWordIds, knownPhraseIds, knownPatternIds, b2ChapterIds),
  ...parseLessons(b2DecidingRaw, "lessons/b2-05-deciding.yaml", knownWordIds, knownPhraseIds, knownPatternIds, b2ChapterIds),
  ...parseLessons(b2PotentialRaw, "lessons/b2-06-potential.yaml", knownWordIds, knownPhraseIds, knownPatternIds, b2ChapterIds),
  ...parseLessons(b2QuotedSpeechRaw, "lessons/b2-07-quoted-speech.yaml", knownWordIds, knownPhraseIds, knownPatternIds, b2ChapterIds),
  ...parseLessons(b2MakingPlansRaw, "lessons/b2-08-making-plans.yaml", knownWordIds, knownPhraseIds, knownPatternIds, b2ChapterIds),
  ...parseLessons(b2ConditionalsRaw, "lessons/b2-09-conditionals.yaml", knownWordIds, knownPhraseIds, knownPatternIds, b2ChapterIds),
  ...parseLessons(b2TroubleRaw, "lessons/b2-10-trouble.yaml", knownWordIds, knownPhraseIds, knownPatternIds, b2ChapterIds),
].sort((a, b) => a.order - b.order);

export function findLesson(id: string): Lesson | undefined {
  return [...n5Lessons, ...b2Lessons].find((u) => u.id === id);
}
