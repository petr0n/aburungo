/**
 * Compiles unit YAML into a single typed, validated, order-sorted list.
 *
 * Add a new unit file by creating src/content/units/<path>.yaml and pushing
 * it into `n5Units` below (or a new export, for N4+ ladders later).
 */
import type { Unit } from "@/types";
import { hanaEnabled } from "@/config";
import { parseUnits } from "./schema";
import { allWords } from "@/content/vocabulary";
import { allPhrases } from "@/content/index";
import { allGrammarPatterns } from "@/content/grammar";

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

const knownWordIds = new Set(allWords.map((w) => w.id));
const knownPhraseIds = new Set(allPhrases.map((p) => p.id));
const knownPatternIds = new Set(allGrammarPatterns.map((p) => p.id));

export const n5Units: Unit[] = [
  ...parseUnits(n5Raw, "units/n5.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5GreetingsContRaw, "units/n5-01-greetings-cont.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5FoodDrinkRaw, "units/n5-02-food-drink.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5ShoppingRaw, "units/n5-03-shopping.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5TransitRaw, "units/n5-04-transit.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5HotelRaw, "units/n5-05-hotel.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5Checkpoint1Raw, "units/n5-02b-checkpoint-1.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5Checkpoint2Raw, "units/n5-04b-checkpoint-2.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5Checkpoint3Raw, "units/n5-07b-checkpoint-3.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5DirectionsRaw, "units/n5-06-directions.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5WeatherRaw, "units/n5-07-weather.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5IntegrationRaw, "units/n5-08-integration.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5DatesRaw, "units/n5-09-dates.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5CheckpointRaw, "units/n5-10-checkpoint.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5RelativeTimeRaw, "units/n5-11-relative-time.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5FinalCheckpointRaw, "units/n5-12-final-checkpoint.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5ProductionCheckpointRaw, "units/n5-13-production-checkpoint.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
]
  .sort((a, b) => a.order - b.order)
  /**
   * Hana units leave the ladder entirely when the AI is shelved (DR-023).
   *
   * Filtering here rather than in LearnPage is what keeps the rest of the app
   * from needing to know Hana exists: the orchestrator, the step router, the
   * can-do helpers and the walkthrough all see one consistent ladder that
   * simply ends at unit 44. Gating further down would leave the units on the
   * ladder as screens that apologise for themselves — the exact dead end
   * DR-022 was written to remove.
   *
   * Keyed off the checkpoint kind rather than a list of ids, so a Hana unit
   * added later is covered without touching this.
   */
  .filter((u) => hanaEnabled || (u.checkpoint !== "conversation" && u.checkpoint !== "can-do"));

export function findUnit(id: string): Unit | undefined {
  return n5Units.find((u) => u.id === id);
}
