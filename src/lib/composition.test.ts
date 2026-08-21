import { describe, expect, it } from "vitest";
import type { Phrase, Word, WordType } from "@/types";
import { buildCompositionFrame, frameAnswer, FRAME_OPTIONS_MAX } from "./composition";

// Fixtures reference existing taught content (restaurant.water-please and the
// food & drink lesson words) — no Japanese is composed in this file beyond
// what the mechanism under test derives, which is its sanctioned job (03 §8).
function word(id: string, reading: string, english: string, wordType: WordType = "noun"): Word {
  return { id, japanese: reading, reading, romaji: id, english, wordType };
}

const mizu = word("vocab.mizu", "みず", "water");
const ocha = word("vocab.ocha", "おちゃ", "tea");
const koohii = word("vocab.koohii", "コーヒー", "coffee");
const taberu = word("vocab.taberu", "たべる", "to eat", "verb");

const waterPlease: Phrase = {
  id: "restaurant.water-please",
  japanese: "水をください",
  reading: "みずをください",
  romaji: "mizu o kudasai",
  english: "Water, please.",
  scenario: "restaurant",
};

describe("buildCompositionFrame", () => {
  it("lifts the first matching word out of the phrase reading", () => {
    const frame = buildCompositionFrame(waterPlease, [mizu, ocha]);

    expect(frame).not.toBeNull();
    expect(frame?.before).toBe("");
    expect(frame?.after).toBe("をください");
    expect(frame?.slotWordId).toBe("vocab.mizu");
    expect(frame?.english).toBe("Water, please.");
  });

  it("offers same-word-type candidates as options, attested word included", () => {
    const frame = buildCompositionFrame(waterPlease, [mizu, ocha, koohii, taberu]);

    expect(frame?.options.map((o) => o.id)).toEqual(["vocab.mizu", "vocab.ocha", "vocab.koohii"]);
  });

  it("caps the options", () => {
    // Synthetic ascii fixtures, like dailyLoop.test.ts — the function only
    // does string work, and ascii avoids inventing pseudo-Japanese readings.
    const many = Array.from({ length: 10 }, (_, i) => word(`vocab.n${i}`, `drink${i}`, `drink ${i}`));
    const frame = buildCompositionFrame(waterPlease, [mizu, ...many]);

    expect(frame?.options.length).toBe(FRAME_OPTIONS_MAX);
  });

  it("returns null when no candidate word appears in the phrase", () => {
    expect(buildCompositionFrame(waterPlease, [ocha, koohii])).toBeNull();
  });

  it("returns null rather than slotting a word that appears twice (ambiguous)", () => {
    const w = word("w1", "aa", "w1");
    const echo: Phrase = { ...waterPlease, reading: "aa-aa" };
    expect(buildCompositionFrame(echo, [w])).toBeNull();
  });

  it("returns null rather than a frame with no text around the slot", () => {
    const bare: Phrase = { ...waterPlease, reading: "みず" };
    expect(buildCompositionFrame(bare, [mizu])).toBeNull();
  });

  it("skips options whose reading already sits in the frame text", () => {
    const kudasai = word("vocab.kudasai", "ください", "please");
    const frame = buildCompositionFrame(waterPlease, [mizu, kudasai]);

    expect(frame?.options.map((o) => o.id)).toEqual(["vocab.mizu"]);
  });

  it("skips duplicate readings so every option is a distinct answer", () => {
    const mizuAgain = word("vocab.mizu-2", "みず", "water (dup)");
    const frame = buildCompositionFrame(waterPlease, [mizu, mizuAgain, ocha]);

    expect(frame?.options.map((o) => o.id)).toEqual(["vocab.mizu", "vocab.ocha"]);
  });
});

describe("frameAnswer", () => {
  it("slots the chosen word's reading into the frame", () => {
    const frame = buildCompositionFrame(waterPlease, [mizu, ocha]);

    expect(frameAnswer(frame!, mizu)).toBe("みずをください");
    expect(frameAnswer(frame!, ocha)).toBe("おちゃをください");
  });
});
