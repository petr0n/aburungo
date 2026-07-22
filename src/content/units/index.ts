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
import n5GreetingsContRaw from "./n5-01-greetings-cont.yaml";
import n5FoodDrinkRaw from "./n5-02-food-drink.yaml";
import n5ShoppingRaw from "./n5-03-shopping.yaml";
import n5TransitRaw from "./n5-04-transit.yaml";
import n5HotelRaw from "./n5-05-hotel.yaml";
import n5DirectionsRaw from "./n5-06-directions.yaml";
import n5WeatherRaw from "./n5-07-weather.yaml";
import n5IntegrationRaw from "./n5-08-integration.yaml";

const knownWordIds = new Set(allWords.map((w) => w.id));
const knownPhraseIds = new Set(allPhrases.map((p) => p.id));

export const n5Units: Unit[] = [
  ...parseUnits(n5Raw, "units/n5.yaml", knownWordIds, knownPhraseIds),
  ...parseUnits(n5GreetingsContRaw, "units/n5-01-greetings-cont.yaml", knownWordIds, knownPhraseIds),
  ...parseUnits(n5FoodDrinkRaw, "units/n5-02-food-drink.yaml", knownWordIds, knownPhraseIds),
  ...parseUnits(n5ShoppingRaw, "units/n5-03-shopping.yaml", knownWordIds, knownPhraseIds),
  ...parseUnits(n5TransitRaw, "units/n5-04-transit.yaml", knownWordIds, knownPhraseIds),
  ...parseUnits(n5HotelRaw, "units/n5-05-hotel.yaml", knownWordIds, knownPhraseIds),
  ...parseUnits(n5DirectionsRaw, "units/n5-06-directions.yaml", knownWordIds, knownPhraseIds),
  ...parseUnits(n5WeatherRaw, "units/n5-07-weather.yaml", knownWordIds, knownPhraseIds),
  ...parseUnits(n5IntegrationRaw, "units/n5-08-integration.yaml", knownWordIds, knownPhraseIds),
].sort((a, b) => a.order - b.order);

export function findUnit(id: string): Unit | undefined {
  return n5Units.find((u) => u.id === id);
}
