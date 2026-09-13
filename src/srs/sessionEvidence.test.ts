import { describe, it, expect } from "vitest";
import { createSessionEvidence } from "./sessionEvidence";

describe("session evidence", () => {
  it("promotes a first independent success", () => {
    const evidence = createSessionEvidence();
    expect(evidence.ratingFor("a", true)).toBe("got-it");
  });

  it("demotes on a miss", () => {
    const evidence = createSessionEvidence();
    expect(evidence.ratingFor("a", false)).toBe("didnt");
  });

  // DR-040 rule 5: at most one promotion per item per session, shared across
  // the opening review and every checkpoint in it.
  it("promotes an item only once however often it succeeds", () => {
    const evidence = createSessionEvidence();
    expect(evidence.ratingFor("a", true)).toBe("got-it");
    expect(evidence.ratingFor("a", true)).toBeNull();
    expect(evidence.ratingFor("a", true)).toBeNull();
  });

  // Rule 4: a successful retry cannot erase the initial miss.
  it("does not promote after a miss, however many retries succeed", () => {
    const evidence = createSessionEvidence();
    expect(evidence.ratingFor("a", false)).toBe("didnt");
    expect(evidence.ratingFor("a", true)).toBeNull();
    expect(evidence.ratingFor("a", true)).toBeNull();
  });

  // Rule 5 again, the other order: success then miss ends at the miss.
  it("lets a later miss override an earlier success", () => {
    const evidence = createSessionEvidence();
    expect(evidence.ratingFor("a", true)).toBe("got-it");
    expect(evidence.ratingFor("a", false)).toBe("didnt");
    expect(evidence.ratingFor("a", true)).toBeNull();
  });

  // "Repeated misses must not keep moving the due date later" is the scheduler's
  // job -- every miss is box 1, not box+1 -- but they must keep applying, or a
  // second miss in a checkpoint would be silently ignored.
  it("keeps applying repeated misses", () => {
    const evidence = createSessionEvidence();
    expect(evidence.ratingFor("a", false)).toBe("didnt");
    expect(evidence.ratingFor("a", false)).toBe("didnt");
  });

  it("tracks each item separately", () => {
    const evidence = createSessionEvidence();
    expect(evidence.ratingFor("a", true)).toBe("got-it");
    expect(evidence.ratingFor("b", true)).toBe("got-it");
    expect(evidence.ratingFor("a", true)).toBeNull();
  });
});
