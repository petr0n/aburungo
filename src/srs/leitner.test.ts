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

  it("caps box at 5 even when the learner keeps getting it right", () => {
    const current: ReviewState = {
      phraseId: "phrase-d",
      box: 5,
      dueAt: NOW - DAY_MS,
    };

    const result = schedule(current, "got-it", NOW, "phrase-d");

    expect(result.box).toBe(5);
    expect(result.dueAt).toBe(NOW + BOX_DURATION_DAYS[5] * DAY_MS);
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
