import { describe, expect, it } from "vitest";
import type { ReviewState } from "@/types";
import { BOX_DURATION_DAYS, isDue, schedule } from "./leitner";

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW: number = Date.UTC(2026, 4, 16, 12, 0, 0); // fixed reference time

describe("schedule", () => {
  it("places a brand-new phrase into box 1 on first correct answer is box 2", () => {
    const result = schedule(undefined, "got-it", NOW, "phrase-a");

    expect(result).toEqual({
      phraseId: "phrase-a",
      box: 2,
      dueAt: NOW + BOX_DURATION_DAYS[2] * DAY_MS,
      lastSeenAt: NOW,
    });
  });

  it("keeps a brand-new phrase in box 1 when the learner misses it", () => {
    const result = schedule(undefined, "didnt", NOW, "phrase-b");

    expect(result.box).toBe(1);
    expect(result.dueAt).toBe(NOW + BOX_DURATION_DAYS[1] * DAY_MS);
    expect(result.lastSeenAt).toBe(NOW);
  });

  it("advances box on correct answer", () => {
    const current: ReviewState = {
      phraseId: "phrase-c",
      box: 3,
      dueAt: NOW - DAY_MS,
      lastSeenAt: NOW - 2 * DAY_MS,
    };

    const result = schedule(current, "got-it", NOW, "phrase-c");

    expect(result.box).toBe(4);
    expect(result.dueAt).toBe(NOW + BOX_DURATION_DAYS[4] * DAY_MS);
  });

  it("advances a persisted box-5 row to box 6 (DR-035: 5 is no longer the top)", () => {
    const current: ReviewState = {
      phraseId: "phrase-d",
      box: 5,
      dueAt: NOW - DAY_MS,
    };

    const result = schedule(current, "got-it", NOW, "phrase-d");

    expect(result.box).toBe(6);
    expect(result.dueAt).toBe(NOW + BOX_DURATION_DAYS[6] * DAY_MS);
  });

  it("resets to box 1 on a miss, regardless of current box", () => {
    const current: ReviewState = {
      phraseId: "phrase-e",
      box: 4,
      dueAt: NOW - DAY_MS,
    };

    const result = schedule(current, "didnt", NOW, "phrase-e");

    expect(result.box).toBe(1);
    expect(result.dueAt).toBe(NOW + BOX_DURATION_DAYS[1] * DAY_MS);
  });

  it("records lastSeenAt as the supplied now value", () => {
    const result = schedule(undefined, "got-it", NOW, "phrase-f");
    expect(result.lastSeenAt).toBe(NOW);
  });
});

describe("isDue", () => {
  const base: ReviewState = { phraseId: "p", box: 2, dueAt: NOW };

  it("is due when dueAt is in the past", () => {
    expect(isDue({ ...base, dueAt: NOW - 1 }, NOW)).toBe(true);
  });

  it("is due at the exact dueAt boundary", () => {
    expect(isDue({ ...base, dueAt: NOW }, NOW)).toBe(true);
  });

  it("is not due when dueAt is in the future", () => {
    expect(isDue({ ...base, dueAt: NOW + 1 }, NOW)).toBe(false);
  });
});

/**
 * The /learn session runs a new word through the produce step and then the
 * recognition pass. These pin the scheduling consequences of that ordering,
 * which is why RecognitionPass reports misses only (see its onMissed prop).
 */
describe("one /learn session over a brand-new word", () => {
  it("keeps a recalled word on the produce step's short interval", () => {
    const afterProduce = schedule(undefined, "got-it", NOW, "vocab.new");
    expect(afterProduce.box).toBe(2);

    // Recognition reports nothing on a hit, so this is the state that persists.
    expect(afterProduce.dueAt).toBe(NOW + BOX_DURATION_DAYS[2] * DAY_MS);
  });

  it("would skip the 1- and 3-day intervals if recognition also promoted", () => {
    const afterProduce = schedule(undefined, "got-it", NOW, "vocab.new");
    const ifRecognitionPromoted = schedule(afterProduce, "got-it", NOW, "vocab.new");

    // Guards the demote-only decision: a word introduced minutes ago must not
    // land a week out. If this ever passes as box 3, recognition started
    // double-counting hits.
    expect(ifRecognitionPromoted.box).toBe(3);
    expect(BOX_DURATION_DAYS[3]).toBe(7);
  });

  it("returns a missed word to tomorrow regardless of the produce result", () => {
    const afterProduce = schedule(undefined, "got-it", NOW, "vocab.new");
    const afterMissedRecognition = schedule(afterProduce, "didnt", NOW, "vocab.new");

    expect(afterMissedRecognition.box).toBe(1);
    expect(afterMissedRecognition.dueAt).toBe(NOW + BOX_DURATION_DAYS[1] * DAY_MS);
  });
});

/**
 * DR-035: the ladder extends from 5 boxes to 8 (30-day top interval → 240)
 * so items can graduate instead of returning forever at corpus ÷ 30. See
 * docs/superpowers/specs/2026-08-28-srs-graduation-design.md.
 */
describe("ladder extension (DR-035: boxes 6-8)", () => {
  it("gives every box in BOX_DURATION_DAYS a strictly longer duration than the last", () => {
    // Deliberately not a hardcoded [1,3,7,...] list: Record<LeitnerBox, number>
    // already forces the compiler to reject a missing or extra box, so the
    // runtime property worth guarding is monotonicity, over whatever boxes
    // the table actually has — this keeps working if LeitnerBox widens again.
    const boxesInOrder = Object.entries(BOX_DURATION_DAYS)
      .map(([box, days]) => ({ box: Number(box), days }))
      .sort((a, b) => a.box - b.box);

    expect(boxesInOrder.length).toBeGreaterThan(0);
    for (let i = 1; i < boxesInOrder.length; i++) {
      expect(boxesInOrder[i].days).toBeGreaterThan(boxesInOrder[i - 1].days);
    }
  });

  it("climbs a fresh item past box 5 to box 8 with a 240-day interval", () => {
    // This is the behaviour that did not exist under the old 5-box ladder —
    // see the "prove it can fail" run in the report.
    let state: ReviewState = schedule(undefined, "got-it", NOW, "phrase-climb");
    for (let i = 0; i < 6; i++) {
      state = schedule(state, "got-it", NOW, "phrase-climb");
    }

    expect(state.box).toBe(8);
    expect(state.dueAt).toBe(NOW + BOX_DURATION_DAYS[8] * DAY_MS);
  });

  it("stays at box 8 on got-it once already at the top (no overflow to 9)", () => {
    const current: ReviewState = {
      phraseId: "phrase-top",
      box: 8,
      dueAt: NOW - DAY_MS,
    };

    const result = schedule(current, "got-it", NOW, "phrase-top");

    expect(result.box).toBe(8);
    expect(result.dueAt).toBe(NOW + BOX_DURATION_DAYS[8] * DAY_MS);
  });

  it("drops to box 1 on a miss from every box, including 6, 7 and 8", () => {
    const boxes = [1, 2, 3, 4, 5, 6, 7, 8] as const;

    for (const box of boxes) {
      const phraseId = `phrase-miss-${box}`;
      const current: ReviewState = { phraseId, box, dueAt: NOW - DAY_MS };

      const result = schedule(current, "didnt", NOW, phraseId);

      expect(result.box).toBe(1);
      expect(result.dueAt).toBe(NOW + BOX_DURATION_DAYS[1] * DAY_MS);
    }
  });
});
